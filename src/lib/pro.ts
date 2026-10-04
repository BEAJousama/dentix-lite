/** Where Lite sends people for the full product. Update PRO_URL once your store page is live. */
export const DEMO_URL = "https://dentix-mu.vercel.app";
export const PRO_URL = "https://dentix-mu.vercel.app";

/** Routes that only exist in Dentix Pro, keyed by their first path segment. */
export const proFeatures: Record<
  string,
  { title: string; description: string; image: string; highlights: string[] }
> = {
  appointments: {
    title: "Appointment calendar",
    description:
      "Day, week and month scheduling with multi-dentist lanes, filters, an appointment drawer and a booking dialog that catches double bookings.",
    image: "/pro/appointments.jpg",
    highlights: [
      "Day / week / month views",
      "Conflict detection",
      "Status workflow from scheduled to completed",
    ],
  },
  patients: {
    title: "Patient workspace & dental chart",
    description:
      "A complete patient record with an interactive odontogram, medical history and allergy alerts, treatments, appointments, files, billing and notes.",
    image: "/pro/patient-profile.jpg",
    highlights: [
      "Interactive FDI dental chart, 7 tooth states",
      "Medical history with allergy alerts",
      "Treatments, files, billing and notes tabs",
    ],
  },
  dentists: {
    title: "Dentist profiles",
    description:
      "Dentist directory and profiles with availability, today's patients, performance charts and top treatments.",
    image: "/pro/dentists.jpg",
    highlights: ["Weekly availability", "Performance analytics", "Workload"],
  },
  staff: {
    title: "Staff management",
    description:
      "Team directory with roles, schedules and availability for dentists, assistants and front desk.",
    image: "/pro/staff.jpg",
    highlights: ["Roles and schedules", "Availability status", "Team table"],
  },
  treatments: {
    title: "Treatment catalog",
    description:
      "Treatments with pricing and duration, clinical cases and a progression from consultation to completion.",
    image: "/pro/treatments.jpg",
    highlights: ["Catalog with prices", "Clinical cases", "Case progression"],
  },
  prescriptions: {
    title: "Prescriptions",
    description:
      "Prescription records and a prescription form with a documented-allergy guard (demo only).",
    image: "/pro/prescriptions.jpg",
    highlights: ["Prescription records", "Allergy guard", "Form validation"],
  },
  invoices: {
    title: "Invoices & PDF export",
    description:
      "Invoice list, a print-ready invoice with PDF download, and payment recording that updates balances everywhere.",
    image: "/pro/invoices.jpg",
    highlights: ["PDF download and print", "Partial payments", "Live balances"],
  },
  payments: {
    title: "Payments analytics",
    description:
      "Revenue, collections, payment methods and a full transaction history.",
    image: "/pro/payments.jpg",
    highlights: ["Revenue trends", "Payment methods", "Transactions table"],
  },
  messages: {
    title: "Patient inbox",
    description:
      "SMS and email conversations with appointment, payment and follow-up templates, personalized for each patient.",
    image: "/pro/messages.jpg",
    highlights: [
      "SMS and email channels",
      "Message templates",
      "Patient context",
    ],
  },
  reports: {
    title: "Reports",
    description:
      "Financial, appointment, patient, treatment and dentist reports with charts and CSV export.",
    image: "/pro/reports.jpg",
    highlights: ["Five report categories", "Charts", "CSV export"],
  },
  settings: {
    title: "Clinic settings",
    description:
      "Clinic profile, opening hours, appointment rules, billing, notifications, branding with live preview, team and security.",
    image: "/pro/settings.jpg",
    highlights: ["Opening hours", "Notification matrix", "Branding preview"],
  },
};
