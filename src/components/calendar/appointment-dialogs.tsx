"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  CalendarDays,
  Clock,
  MapPin,
  Stethoscope,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Avatar,
  Button,
  Field,
  Modal,
  StatusBadge,
} from "@/components/ui/primitives";
import { useClinic } from "@/hooks/use-clinic";
import { dentists } from "@/data/dentists";
import { dateLabel, money } from "@/lib/utils";
import type { AppointmentStatus } from "@/types";
const statuses: AppointmentStatus[] = [
  "Scheduled",
  "Confirmed",
  "Checked In",
  "In Treatment",
  "Completed",
  "Cancelled",
  "No Show",
];
const schema = z.object({
  patientId: z.string().min(1),
  dentistId: z.string().min(1),
  treatmentId: z.string().min(1),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  duration: z.coerce.number().min(15).max(240),
  room: z.string(),
  tooth: z.string(),
  status: z.enum(statuses),
  notes: z.string(),
});
type Values = z.input<typeof schema>;
export function AppointmentDrawer() {
  const c = useClinic();
  const a = c.appointments.find((x) => x.id === c.appointmentId);
  const [confirm, setConfirm] = useState(false);
  if (!a) return null;
  const p = c.patients.find((x) => x.id === a.patientId)!;
  const d = dentists.find((x) => x.id === a.dentistId)!;
  const t = c.treatments.find((x) => x.id === a.treatmentId)!;
  const index = statuses.indexOf(a.status);
  return (
    <>
      <Modal
        open={!!a}
        onClose={() => c.setAppointmentId(null)}
        title="Appointment details"
        description={a.id}
        drawer
      >
        <div className="dialog-body stack">
          <Link
            href={`/patients/${p.slug}`}
            className="patient-summary"
            onClick={() => c.setAppointmentId(null)}
          >
            <Avatar name={p.name} color={p.color} size="lg" />
            <div>
              <h2>{p.name}</h2>
              <p>
                {p.id} · {p.age} years old
              </p>
            </div>
            <ArrowRight size={18} />
          </Link>
          <div className="appointment-feature">
            <span className="eyebrow">TREATMENT</span>
            <h2>{t.name}</h2>
            <p>
              Tooth {a.tooth} · {money(t.price)}
            </p>
            <StatusBadge status={a.status} />
          </div>
          <div className="detail-list">
            <div>
              <CalendarDays />
              <span>
                Date<strong>{dateLabel(a.date)}</strong>
              </span>
            </div>
            <div>
              <Clock />
              <span>
                Time
                <strong>
                  {a.time} · {a.duration} minutes
                </strong>
              </span>
            </div>
            <div>
              <Stethoscope />
              <span>
                Dentist<strong>{d.name}</strong>
              </span>
            </div>
            <div>
              <MapPin />
              <span>
                Room<strong>{a.room}</strong>
              </span>
            </div>
          </div>
          {p.id === "PT-10428" && (
            <div className="medical-alert">
              <ShieldAlert size={18} />
              <span>
                <strong>Penicillin allergy</strong>Review medical history before
                treatment.
              </span>
            </div>
          )}
          <div>
            <h3>Appointment notes</h3>
            <p className="note-box">{a.notes || "No additional notes."}</p>
          </div>
          <Field label="Appointment status">
            <select
              value={a.status}
              onChange={(e) =>
                c.updateAppointment(a.id, {
                  status: e.target.value as AppointmentStatus,
                })
              }
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <div className="stack">
            {index < 4 && (
              <Button
                variant="primary"
                onClick={() =>
                  c.updateAppointment(a.id, { status: statuses[index + 1] })
                }
              >
                {index === 1
                  ? "Check in patient"
                  : `Mark ${statuses[index + 1].toLowerCase()}`}
                <ArrowRight size={16} />
              </Button>
            )}
            <div className="button-row">
              <Button
                onClick={() => {
                  c.setBooking({ appointment: a });
                  c.setAppointmentId(null);
                }}
              >
                Reschedule / Edit
              </Button>
              <Button
                onClick={() => {
                  c.sendMessage({
                    id: `MSG-${crypto.randomUUID()}`,
                    patientId: p.id,
                    body: `Reminder: your ${t.name.toLowerCase()} appointment is on ${dateLabel(a.date)} at ${a.time} with ${d.name}.`,
                    direction: "out",
                    channel: "SMS",
                    time: "Now",
                    automated: true,
                  });
                }}
              >
                Send reminder
              </Button>
            </div>
            {a.status !== "Cancelled" && (
              <Button variant="danger" onClick={() => setConfirm(true)}>
                Cancel appointment
              </Button>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Cancel this appointment?"
        description="The appointment will remain in the patient’s history as cancelled."
      >
        <div className="dialog-body button-row">
          <Button onClick={() => setConfirm(false)}>Keep appointment</Button>
          <Button
            variant="danger"
            onClick={() => {
              c.updateAppointment(a.id, { status: "Cancelled" });
              setConfirm(false);
            }}
          >
            Confirm cancellation
          </Button>
        </div>
      </Modal>
    </>
  );
}
export function NewAppointmentDialog() {
  const c = useClinic();
  return (
    <Modal
      open={!!c.booking}
      onClose={() => c.setBooking(null)}
      title={c.booking?.appointment ? "Edit appointment" : "New appointment"}
      description="A little planning. A better patient experience."
      wide
    >
      {c.booking && (
        <AppointmentForm
          key={c.booking.appointment?.id || c.booking.patientId || "new"}
        />
      )}
    </Modal>
  );
}
function AppointmentForm() {
  const c = useClinic();
  const a = c.booking?.appointment;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<Values>({
    defaultValues: {
      patientId: a?.patientId || c.booking?.patientId || c.patients[0].id,
      dentistId: a?.dentistId || c.booking?.dentistId || "DEN-001",
      treatmentId: a?.treatmentId || c.booking?.treatmentId || "TRT-003",
      date: a?.date || c.booking?.date || "2026-10-06",
      time: a?.time || c.booking?.time || "10:30",
      duration: a?.duration || 60,
      room: a?.room || "Treatment Room 2",
      tooth: a?.tooth || "#16",
      status: a?.status || "Confirmed",
      notes: a?.notes || "",
    },
  });
  const values = useWatch({ control });
  const p = c.patients.find((p) => p.id === values.patientId);
  const t = c.treatments.find((t) => t.id === values.treatmentId);
  const d = dentists.find((d) => d.id === values.dentistId);
  return (
    <form
      onSubmit={handleSubmit((raw) => {
        const parsed = schema.safeParse(raw);
        if (!parsed.success) {
          parsed.error.issues.forEach((i) =>
            setError(i.path[0] as keyof Values, { message: i.message }),
          );
          return;
        }
        const v = parsed.data;
        const start =
          Number(v.time.split(":")[0]) * 60 + Number(v.time.split(":")[1]);
        const conflict = c.appointments.find((x) => {
          const xs =
            Number(x.time.split(":")[0]) * 60 + Number(x.time.split(":")[1]);
          return (
            x.id !== a?.id &&
            x.date === v.date &&
            x.status !== "Cancelled" &&
            (x.dentistId === v.dentistId || x.room === v.room) &&
            start < xs + x.duration &&
            start + v.duration > xs
          );
        });
        if (conflict && !c.settings["Allow double bookings"]) {
          toast.error("This dentist or room is already booked at that time.");
          return;
        }
        if (a) c.updateAppointment(a.id, v);
        else c.addAppointment({ ...v, id: `APT-${crypto.randomUUID()}` });
        c.setBooking(null);
      })}
    >
      <div className="booking-layout">
        <div className="form-grid">
          <Field label="Patient">
            <select {...register("patientId")}>
              {c.patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.id}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Dentist">
            <select {...register("dentistId")}>
              {dentists.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Treatment">
            <select {...register("treatmentId")}>
              {c.treatments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tooth / area">
            <input {...register("tooth")} />
          </Field>
          <Field label="Date" error={errors.date?.message}>
            <input type="date" {...register("date")} />
          </Field>
          <Field label="Start time" error={errors.time?.message}>
            <input type="time" min="08:00" max="18:00" {...register("time")} />
          </Field>
          <Field label="Duration (minutes)" error={errors.duration?.message}>
            <input
              type="number"
              step="15"
              min="15"
              max="240"
              {...register("duration")}
            />
          </Field>
          <Field label="Treatment room">
            <select {...register("room")}>
              {[1, 2, 3, 4].map((r) => (
                <option key={r}>Treatment Room {r}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select {...register("status")}>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Notes">
            <textarea
              {...register("notes")}
              placeholder="Anything the care team should know?"
              rows={3}
            />
          </Field>
        </div>
        <aside className="booking-summary">
          <span className="eyebrow">APPOINTMENT SUMMARY</span>
          <Avatar name={p?.name || ""} color={p?.color} size="lg" />
          <h2>{p?.name}</h2>
          <p>
            {t?.name} · {values.tooth}
          </p>
          <hr />
          <p>{d?.name}</p>
          <p>{values.date && dateLabel(values.date)}</p>
          <strong>
            {values.time} · {String(values.duration)} minutes
          </strong>
          <hr />
          <span className="muted">Estimated cost</span>
          <h2>{money(t?.price || 0)}</h2>
          <small>Final cost may vary by treatment plan.</small>
        </aside>
      </div>
      <div className="dialog-footer">
        <Button type="button" onClick={() => c.setBooking(null)}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {a ? "Save changes" : "Create appointment"}
        </Button>
      </div>
    </form>
  );
}
