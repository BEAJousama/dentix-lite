"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Users, UserCheck, UserPlus, Wallet } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Patient } from "@/types";
import {
  Avatar,
  Button,
  Card,
  Field,
  Menu,
  MetricCard,
  Modal,
  PageHeader,
  SearchInput,
  Select,
  StatusBadge,
} from "@/components/ui/primitives";
import { DataTable } from "@/components/ui/data-table";
import { useClinic } from "@/hooks/use-clinic";
import { dateLabel, money } from "@/lib/utils";
export function PatientsList() {
  const c = useClinic();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All patients");
  const [add, setAdd] = useState(false);
  const filtered = c.patients.filter(
    (p) =>
      `${p.name} ${p.email} ${p.id}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "All patients" ||
        filter === p.status ||
        (filter === "Outstanding balance" && p.balance > 0) ||
        (filter === "Upcoming appointment" &&
          c.appointments.some(
            (a) =>
              a.patientId === p.id &&
              a.date >= "2026-10-05" &&
              a.status !== "Cancelled",
          ))),
  );
  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "name",
      header: "Patient",
      cell: ({ row: { original: p } }) => (
        <Link className="person-cell" href={`/patients/${p.slug}`}>
          <Avatar name={p.name} color={p.color} />
          <span>
            <strong>{p.name}</strong>
            <small>{p.id}</small>
          </span>
        </Link>
      ),
    },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <span className="muted">{String(getValue())}</span>
      ),
    },
    {
      accessorKey: "lastVisit",
      header: "Last visit",
      cell: ({ getValue }) => dateLabel(String(getValue()), "MMM d, yyyy"),
    },
    {
      id: "upcoming",
      accessorFn: (p) =>
        c.appointments
          .filter(
            (a) =>
              a.patientId === p.id &&
              a.date >= "2026-10-05" &&
              a.status !== "Cancelled",
          )
          .sort((a, b) => a.date.localeCompare(b.date))[0]?.date || "—",
      header: "Upcoming",
      cell: ({ getValue }) =>
        getValue() === "—" ? (
          "—"
        ) : (
          <span className="text-teal">
            {dateLabel(String(getValue()), "MMM d, yyyy")}
          </span>
        ),
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ getValue }) => (
        <strong className={Number(getValue()) > 0 ? "balance-due" : "muted"}>
          {money(Number(getValue()))}
        </strong>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={String(getValue())} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row: { original: p } }) => (
        <Menu
          items={[
            {
              label: "View profile",
              onClick: () => router.push(`/patients/${p.slug}`),
            },
            {
              label: "Schedule appointment",
              onClick: () => c.setBooking({ patientId: p.id }),
            },
            {
              label: "Create invoice",
              onClick: () => router.push("/invoices"),
            },
            {
              label: "Send message",
              onClick: () => router.push(`/messages?patient=${p.id}`),
            },
            {
              label:
                p.status === "Inactive" ? "Restore patient" : "Archive patient",
              onClick: () =>
                c.updatePatient(p.id, {
                  status: p.status === "Inactive" ? "Active" : "Inactive",
                }),
              danger: p.status !== "Inactive",
            },
          ]}
        />
      ),
    },
  ];
  return (
    <>
      <PageHeader
        eyebrow="PATIENT MANAGEMENT"
        title="Patients"
        description="Thoughtful care starts with knowing your patients."
        actions={
          <Button variant="primary" onClick={() => setAdd(true)}>
            <Plus size={16} />
            Add patient
          </Button>
        }
      />
      <div className="metrics-grid four">
        <MetricCard
          label="Total patients"
          value="2,438"
          change="8.4%"
          icon={<Users size={18} />}
        />
        <MetricCard
          label="Active patients"
          value="1,872"
          change="6.2%"
          icon={<UserCheck size={18} />}
        />
        <MetricCard
          label="New this month"
          value="52"
          change="12"
          icon={<UserPlus size={18} />}
        />
        <MetricCard
          label="Outstanding balance"
          value="$12,420"
          change="3.2%"
          negative
          icon={<Wallet size={18} />}
        />
      </div>
      <Card>
        <div className="list-toolbar">
          <div>
            <h2>
              Patient directory{" "}
              <span className="count-badge">{c.patients.length}</span>
            </h2>
            <p className="muted">Your sample patient records, in one place.</p>
          </div>
          <div className="toolbar-controls">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search patients..."
            />
            <Select
              label="Patient filter"
              value={filter}
              onChange={setFilter}
              options={[
                "All patients",
                "Active",
                "Inactive",
                "New",
                "Follow-up",
                "Outstanding balance",
                "Upcoming appointment",
              ]}
            />
          </div>
        </div>
        <DataTable
          data={filtered}
          columns={columns}
          selectable
          bulkAction={(ps) =>
            ps.forEach((p) => c.updatePatient(p.id, { status: "Inactive" }))
          }
          filename="dentix-patients"
        />
      </Card>
      <Modal
        open={add}
        onClose={() => setAdd(false)}
        title="Add a patient"
        description="Start a new patient record with the essentials."
      >
        {add && <PatientForm onClose={() => setAdd(false)} />}
      </Modal>
    </>
  );
}
const patientSchema = z.object({
  name: z.string().min(3, "Enter a full name"),
  age: z.coerce.number().min(1).max(120),
  email: z.email(),
  phone: z.string().min(7, "Enter a phone number"),
  gender: z.string(),
  insurance: z.string(),
});
function PatientForm({ onClose }: { onClose: () => void }) {
  const c = useClinic();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.input<typeof patientSchema>>({
    defaultValues: {
      name: "",
      age: 30,
      email: "",
      phone: "",
      gender: "Female",
      insurance: "Self-pay",
    },
  });
  return (
    <form
      onSubmit={handleSubmit((raw) => {
        const result = patientSchema.safeParse(raw);
        if (!result.success) {
          result.error.issues.forEach((i) =>
            setError(i.path[0] as keyof typeof raw, { message: i.message }),
          );
          return;
        }
        const p = result.data;
        c.addPatient({
          ...p,
          id: `PT-${crypto.randomUUID()}`,
          slug:
            p.name.toLowerCase().replaceAll(" ", "-") +
            "-" +
            crypto.randomUUID().toString().slice(-4),
          status: "New",
          since: "2026-10-05",
          lastVisit: "TBD",
          balance: 0,
          color: "teal",
          dentistId: "DEN-002",
        });
        onClose();
      })}
    >
      <div className="dialog-body form-grid">
        <Field label="Full name" error={errors.name?.message}>
          <input {...register("name")} placeholder="Patient’s full name" />
        </Field>
        <Field label="Age" error={errors.age?.message}>
          <input type="number" {...register("age")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            {...register("email")}
            placeholder="patient@example.com"
          />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input
            type="tel"
            {...register("phone")}
            placeholder="(415) 555-0100"
          />
        </Field>
        <Field label="Gender">
          <select {...register("gender")}>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </Field>
        <Field label="Insurance">
          <input {...register("insurance")} />
        </Field>
      </div>
      <div className="dialog-footer">
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Create patient
        </Button>
      </div>
    </form>
  );
}
