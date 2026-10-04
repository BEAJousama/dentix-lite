"use client";
import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  Users,
  Wallet,
  CreditCard,
  UserPlus,
  Stethoscope,
  Plus,
  ArrowUpRight,
  ArrowRight,
  Clock,
  ChevronRight,
  Check,
  Bell,
  ShieldAlert,
} from "lucide-react";
import {
  Avatar,
  Button,
  Card,
  MetricCard,
  PageHeader,
  Select,
  StatusBadge,
  Menu,
} from "@/components/ui/primitives";
import { RevenueChart, DistributionChart } from "@/components/charts/analytics";
import { useClinic } from "@/hooks/use-clinic";
import { dentists } from "@/data/dentists";
import { money, dateLabel } from "@/lib/utils";
export function Dashboard() {
  const c = useClinic();
  const [date, setDate] = useState("2026-10-05");
  const [filter, setFilter] = useState("All dentists");
  const schedule = c.appointments
    .filter(
      (a) =>
        a.date === date &&
        (filter === "All dentists" || a.dentistId === filter),
    )
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);
  // Each dentist's booked chair time for the selected day, out of an 8-hour day.
  const workload = dentists.slice(0, 3).map((d) => {
    const visits = c.appointments.filter(
      (a) =>
        a.date === date && a.dentistId === d.id && a.status !== "Cancelled",
    );
    const booked = visits.reduce((sum, a) => sum + a.duration, 0);
    return {
      dentist: d,
      visits: visits.length,
      booked,
      capacity: Math.min(100, Math.round((booked / 480) * 100)),
    };
  });
  const openVisits = Math.floor(
    workload.reduce((sum, w) => sum + Math.max(0, 480 - w.booked), 0) / 45,
  );
  return (
    <>
      <div className="context-line">
        <span>
          <span className="status-dot" />
          CLINIC OVERVIEW
        </span>
        <span>Monday, October 5, 2026</span>
      </div>
      <PageHeader
        title="Good morning, Dr. Carter"
        description="Here’s what’s happening at Dentix today."
        actions={
          <>
            <label className="date-control">
              <CalendarDays size={16} />
              <input
                aria-label="Dashboard date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <Button variant="primary" onClick={() => c.setBooking({ date })}>
              <Plus size={17} />
              New appointment
            </Button>
          </>
        }
      />
      <div className="welcome-strip">
        <div className="welcome-icon">
          <Stethoscope size={22} />
        </div>
        <div>
          <strong>A little clarity. A better day of care.</strong>
          <p>Your team is ready. Let’s make every patient feel looked after.</p>
        </div>
        <Link href="/appointments">
          View your schedule <ArrowUpRight size={17} />
        </Link>
        <div className="welcome-art">
          <svg viewBox="0 0 140 80" fill="none">
            <path
              d="M20 52c16-42 48-46 57-16s35 33 48-10M10 70c34-34 40-29 57-6s50 8 66-22"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="85" cy="25" r="18" stroke="currentColor" />
            <path d="M85 15v20M75 25h20" stroke="currentColor" />
          </svg>
        </div>
      </div>
      <div className="metrics-grid six">
        <MetricCard
          label="Today’s appointments"
          value="18"
          change="3"
          caption="vs. yesterday"
          icon={<CalendarDays size={17} />}
        />
        <MetricCard
          label="Patients today"
          value="14"
          change="2"
          caption="vs. yesterday"
          icon={<Users size={17} />}
        />
        <MetricCard
          label="Today’s revenue"
          value="$2,450"
          change="12.8%"
          caption="vs. yesterday"
          icon={<Wallet size={17} />}
        />
        <MetricCard
          label="Pending payments"
          value="$3,820"
          change="4.2%"
          negative
          caption="vs. last week"
          icon={<CreditCard size={17} />}
        />
        <MetricCard
          label="New patients"
          value="12"
          change="4"
          caption="this week"
          icon={<UserPlus size={17} />}
        />
        <MetricCard
          label="Treatments completed"
          value="37"
          change="8.2%"
          caption="this week"
          icon={<Stethoscope size={17} />}
        />
      </div>
      <div className="dashboard-charts">
        <RevenueChart />
        <DistributionChart />
      </div>
      <div className="dashboard-main-grid">
        <Card
          title="Today’s schedule"
          description={`${dateLabel(date, "EEEE, MMMM d")} · Keep the day running smoothly`}
          action={
            <Link className="text-link" href="/appointments">
              View calendar <ArrowUpRight size={15} />
            </Link>
          }
        >
          <div className="schedule-toolbar">
            <div className="schedule-summary">
              <span className="status-dot" /> {schedule.length} appointments in
              this view
            </div>
            <Select
              label="Filter schedule by dentist"
              value={filter}
              onChange={setFilter}
              options={[
                "All dentists",
                ...dentists.map((d) => ({ value: d.id, label: d.name })),
              ]}
            />
          </div>
          <div className="table-scroll">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>PATIENT / TREATMENT</th>
                  <th>DENTIST</th>
                  <th>STATUS</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {schedule.map((a) => {
                  const p = c.patients.find((p) => p.id === a.patientId)!;
                  const d = dentists.find((d) => d.id === a.dentistId)!;
                  const t = c.treatments.find((t) => t.id === a.treatmentId)!;
                  return (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.time}</strong>
                        <small>{a.duration} min</small>
                      </td>
                      <td>
                        <button
                          className="person-cell"
                          onClick={() => c.setAppointmentId(a.id)}
                        >
                          <Avatar name={p.name} color={p.color} />
                          <span>
                            <strong>{p.name}</strong>
                            <small>{t.name}</small>
                          </span>
                        </button>
                      </td>
                      <td>
                        <span className="dentist-cell">
                          <i className={`avatar-${d.color}`} />
                          {d.name.replace("Dr. ", "Dr. ")}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={a.status} />
                      </td>
                      <td>
                        <Menu
                          items={[
                            {
                              label: "View appointment",
                              onClick: () => c.setAppointmentId(a.id),
                            },
                            {
                              label: "Reschedule",
                              onClick: () => c.setBooking({ appointment: a }),
                            },
                            {
                              label: "Check in",
                              onClick: () =>
                                c.updateAppointment(a.id, {
                                  status: "Checked In",
                                }),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!schedule.length && (
              <div className="empty-state">
                <h3>No appointments on this date</h3>
                <Button onClick={() => c.setBooking({ date })}>
                  Schedule appointment
                </Button>
              </div>
            )}
          </div>
          <Link className="card-bottom-link" href="/appointments">
            See all appointments <ArrowRight size={15} />
          </Link>
        </Card>
        <Card
          title="Dentist workload"
          description="A balanced day for your care team"
          action={
            <Link
              aria-label="View dentists"
              className="icon-button"
              href="/dentists"
            >
              <ArrowUpRight size={17} />
            </Link>
          }
        >
          <div className="workload-list">
            {workload.map(({ dentist: d, visits, booked, capacity }) => (
              <Link
                href={`/dentists/${d.slug}`}
                key={d.id}
                className="workload-item"
              >
                <div className="person-cell">
                  <Avatar name={d.name} color={d.color} />
                  <span>
                    <strong>{d.name}</strong>
                    <small>{d.specialty}</small>
                  </span>
                  <span className="workload-count">
                    {visits}
                    <small>visits</small>
                  </span>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${capacity}%` }} />
                </div>
                <div className="workload-meta">
                  <span>
                    <Clock size={12} />
                    {Math.floor(booked / 60)}h{" "}
                    {String(booked % 60).padStart(2, "0")}m scheduled
                  </span>
                  <span>{capacity}% capacity</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="workload-note">
            <span className="status-dot" />
            Your team has room for {openVisits} more visits today.
          </div>
        </Card>
      </div>
      <div className="dashboard-bottom-grid">
        <Card
          title="Outstanding payments"
          action={
            <Link href="/invoices" className="text-link">
              View all <ChevronRight size={14} />
            </Link>
          }
        >
          <div className="payment-list">
            {c.patients
              .filter((p) =>
                ["PT-10428", "PT-10431", "PT-10436"].includes(p.id),
              )
              .map((p) => (
                <Link
                  href={`/patients/${p.slug}`}
                  key={p.id}
                  className="payment-row"
                >
                  <Avatar name={p.name} color={p.color} size="sm" />
                  <span>
                    <strong>{p.name}</strong>
                    <small>Payment awaiting collection</small>
                  </span>
                  <strong>{money(p.balance)}</strong>
                  <ChevronRight size={15} />
                </Link>
              ))}
          </div>
          <div className="card-note">
            A thoughtful reminder can make all the difference.
          </div>
        </Card>
        <Card
          title="Recent activity"
          action={<span className="subtle-label">LATEST UPDATES</span>}
        >
          <div className="activity-list">
            {[
              {
                icon: CreditCard,
                title: "Payment received",
                detail: "Michael Chen · $120",
                time: "2m",
                color: "teal",
              },
              {
                icon: Check,
                title: "Treatment completed",
                detail: "Michael Chen · Dental Cleaning",
                time: "5m",
                color: "green",
              },
              {
                icon: CalendarDays,
                title: "Appointment rescheduled",
                detail: "Emma Wilson · Oct 7, 1:30 PM",
                time: "28m",
                color: "blue",
              },
              {
                icon: UserPlus,
                title: "New patient registered",
                detail: "Sophia Lee · Patient record created",
                time: "6d",
                color: "violet",
              },
            ].map((a) => (
              <div className="activity-item" key={a.title}>
                <span className={`activity-icon avatar-${a.color}`}>
                  <a.icon size={15} />
                </span>
                <div>
                  <strong>{a.title}</strong>
                  <small>{a.detail}</small>
                </div>
                <time>{a.time}</time>
              </div>
            ))}
          </div>
        </Card>
        <Card
          title="Needs attention"
          action={<span className="count-badge">3</span>}
        >
          <div className="alerts-list">
            <Link href="/patients/sarah-johnson">
              <span className="alert-icon amber">
                <ShieldAlert size={17} />
              </span>
              <div>
                <strong>Medical history review</strong>
                <p>
                  Sarah Johnson’s allergy information needs a review before her
                  visit.
                </p>
                <small>
                  Before Oct 6 appointment <ArrowUpRight size={12} />
                </small>
              </div>
            </Link>
            <Link href="/invoices">
              <span className="alert-icon rose">
                <CreditCard size={17} />
              </span>
              <div>
                <strong>4 outstanding invoices</strong>
                <p>Review balances and send a friendly payment reminder.</p>
              </div>
            </Link>
            <Link href="/patients/emma-wilson">
              <span className="alert-icon blue">
                <Bell size={17} />
              </span>
              <div>
                <strong>Follow-up due</strong>
                <p>Emma Wilson · Post-treatment check-in</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
