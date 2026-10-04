import type { Patient, MedicalRecord, PatientFile, Activity } from "@/types";
const records: [string, number, number, Patient["status"], string][] = [
  ["Sarah Johnson", 34, 620, "Active", "rose"],
  ["Michael Chen", 42, 0, "Active", "blue"],
  ["Emma Wilson", 28, 180, "Follow-up", "violet"],
  ["Daniel Garcia", 51, 420, "Active", "amber"],
  ["Olivia Martinez", 37, 0, "Active", "teal"],
  ["James Anderson", 46, 0, "Active", "blue"],
  ["Sophia Lee", 31, 0, "New", "rose"],
  ["Robert Thompson", 58, 240, "Active", "slate"],
  ["Emily Davis", 26, 380, "Follow-up", "violet"],
  ["William Brown", 63, 0, "Inactive", "amber"],
  ["Mia Clark", 22, 0, "New", "teal"],
  ["Noah Robinson", 39, 0, "Active", "blue"],
];
/** Matches each patient's most recent invoice (Noah's root canal was billed to insurance). */
const lastVisits = [
  "2026-09-18",
  "2026-04-09",
  "2026-09-02",
  "2026-09-10",
  "2026-07-21",
  "2026-09-24",
  "2026-09-29",
  "2026-09-08",
  "2026-09-16",
  "2026-02-03",
  "2026-09-22",
  "2026-09-28",
];
export const patients: Patient[] = records.map(
  ([name, age, balance, status, color], i) => ({
    id: `PT-${10428 + i}`,
    slug: name.toLowerCase().replaceAll(" ", "-"),
    name,
    age,
    gender: i === 0 ? "Female" : i % 2 ? "Male" : "Female",
    phone: `(415) 555-${String(182 + i).padStart(4, "0")}`,
    email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
    since: i === 0 ? "2023-03-14" : "2024-06-12",
    insurance:
      i === 0
        ? "Delta Dental PPO"
        : i % 2
          ? "Cigna Dental"
          : "Delta Dental PPO",
    lastVisit: lastVisits[i],
    balance,
    status,
    color,
    dentistId: i === 0 ? "DEN-001" : `DEN-00${(i % 3) + 1}`,
  }),
);
export const medicalRecords: MedicalRecord[] = [
  {
    patientId: "PT-10428",
    conditions: ["Mild hypertension"],
    allergies: ["Penicillin"],
    medications: ["Lisinopril 10mg"],
    smoking: "No",
    pregnancy: "Not applicable",
    notes:
      "Patient reported sensitivity when drinking cold beverages. Review updated medical history before the next treatment.",
  },
];
export const files: PatientFile[] = [
  {
    id: "FILE-1",
    patientId: "PT-10428",
    name: "Panoramic X-Ray",
    category: "X-rays",
    date: "2026-09-18",
    size: "4.2 MB",
  },
  {
    id: "FILE-2",
    patientId: "PT-10428",
    name: "Insurance Card",
    category: "Insurance",
    date: "2026-03-14",
    size: "840 KB",
  },
  {
    id: "FILE-3",
    patientId: "PT-10428",
    name: "Consent — Root Canal",
    category: "Consent forms",
    date: "2026-10-01",
    size: "120 KB",
  },
];
export const activities: Activity[] = [
  {
    id: "ACT-1",
    patientId: "PT-10428",
    title: "Dental exam completed",
    description: "Dr. Olivia Carter · Routine examination",
    date: "2026-09-18",
    kind: "treatment",
  },
  {
    id: "ACT-2",
    patientId: "PT-10428",
    title: "X-ray uploaded",
    description: "Panoramic X-Ray added to patient files",
    date: "2026-09-18",
    kind: "file",
  },
  {
    id: "ACT-3",
    patientId: "PT-10428",
    title: "Payment of $180 received",
    description: "Visa ending in 4242",
    date: "2026-08-22",
    kind: "payment",
  },
  {
    id: "ACT-4",
    patientId: "PT-10428",
    title: "Teeth cleaning completed",
    description: "Dr. Olivia Carter · Preventive care",
    date: "2026-08-12",
    kind: "treatment",
  },
  {
    id: "ACT-5",
    patientId: "PT-10428",
    title: "Appointment scheduled",
    description: "Follow-up examination confirmed",
    date: "2026-07-30",
    kind: "appointment",
  },
];
