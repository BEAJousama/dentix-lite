"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { patients as initialPatients } from "@/data/patients";
import { appointments as initialAppointments } from "@/data/appointments";
import {
  invoices as initialInvoices,
  payments as initialPayments,
} from "@/data/invoices";
import { messages as initialMessages } from "@/data/messages";
import {
  prescriptions as initialPrescriptions,
  treatments as initialTreatments,
} from "@/data/treatments";
import { staff as initialStaff } from "@/data/dentists";
import { files as initialFiles } from "@/data/patients";
import type {
  Appointment,
  Invoice,
  Message,
  Patient,
  Payment,
  Prescription,
} from "@/types";
import { toast } from "sonner";
function useClinicState() {
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [payments, setPayments] = useState(initialPayments);
  const [messages, setMessages] = useState(initialMessages);
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [booking, setBooking] = useState<{
    patientId?: string;
    appointment?: Appointment;
    date?: string;
    time?: string;
    dentistId?: string;
    treatmentId?: string;
  } | null>(null);
  const [treatments, setTreatments] = useState(initialTreatments);
  const [staff, setStaff] = useState(initialStaff);
  const [files, setFiles] = useState(initialFiles);
  const [toothCharts, setToothCharts] = useState<
    Record<string, Record<number, string>>
  >({
    "PT-10428": {
      16: "In Treatment",
      12: "Completed",
      26: "Crown",
      36: "Planned",
      48: "Missing",
      46: "Implant",
    },
  });
  const [settings, setSettings] = useState<Record<string, string | boolean>>(
    {},
  );
  const updateAppointment = (id: string, patch: Partial<Appointment>) => {
    setAppointments((a) =>
      a.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    );
    toast.success("Appointment updated");
  };
  const addAppointment = (a: Appointment) => {
    setAppointments((x) => [...x, a]);
    toast.success("Appointment created");
  };
  const addPatient = (p: Patient) => {
    setPatients((x) => [p, ...x]);
    toast.success("Patient added");
  };
  const updatePatient = (id: string, patch: Partial<Patient>) => {
    setPatients((x) => x.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    toast.success("Patient updated");
  };
  const addInvoice = (i: Invoice) => {
    setInvoices((x) => [i, ...x]);
    setPatients((x) =>
      x.map((p) =>
        p.id === i.patientId
          ? {
              ...p,
              balance:
                p.balance +
                i.items.reduce((s, v) => s + v.price * v.quantity, 0) -
                i.insurance -
                i.paid,
            }
          : p,
      ),
    );
    toast.success("Invoice created");
  };
  const recordPayment = (id: string, amount: number, method: string) => {
    const invoice = invoices.find((i) => i.id === id);
    if (!invoice) return;
    const due =
      invoice.items.reduce((s, i) => s + i.price * i.quantity, 0) -
      invoice.insurance -
      invoice.paid;
    if (amount <= 0 || amount > due) {
      toast.error("Enter an amount within the outstanding balance");
      return;
    }
    setInvoices((x) =>
      x.map((i) =>
        i.id === id
          ? {
              ...i,
              paid: i.paid + amount,
              status: amount === due ? "Paid" : "Partially Paid",
            }
          : i,
      ),
    );
    setPayments((x) => [
      {
        id: `PAY-${crypto.randomUUID()}`,
        patientId: invoice.patientId,
        invoiceId: id,
        method,
        amount,
        date: "2026-10-05",
        status: "Completed",
      } as Payment,
      ...x,
    ]);
    setPatients((x) =>
      x.map((p) =>
        p.id === invoice.patientId
          ? { ...p, balance: Math.max(0, p.balance - amount) }
          : p,
      ),
    );
    toast.success("Payment recorded");
  };
  const sendMessage = (m: Message) => {
    setMessages((x) => [...x, m]);
    toast.success("Message sent in demo");
  };
  const addPrescription = (p: Prescription) => {
    setPrescriptions((x) => [p, ...x]);
    toast.success("Prescription saved in demo");
  };
  return {
    toothCharts,
    setToothCharts,
    treatments,
    setTreatments,
    staff,
    setStaff,
    files,
    setFiles,
    patients,
    appointments,
    invoices,
    payments,
    messages,
    prescriptions,
    appointmentId,
    setAppointmentId,
    booking,
    setBooking,
    updateAppointment,
    addAppointment,
    addPatient,
    updatePatient,
    addInvoice,
    recordPayment,
    sendMessage,
    addPrescription,
    settings,
    setSettings,
  };
}
const ClinicContext = createContext<ReturnType<typeof useClinicState> | null>(
  null,
);
export function ClinicProvider({ children }: { children: ReactNode }) {
  const state = useClinicState();
  return (
    <ClinicContext.Provider value={state}>{children}</ClinicContext.Provider>
  );
}
export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) throw new Error("useClinic requires ClinicProvider");
  return context;
}
