export type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "Checked In"
  | "In Treatment"
  | "Completed"
  | "Cancelled"
  | "No Show";
export interface Patient {
  id: string;
  slug: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  since: string;
  insurance: string;
  lastVisit: string;
  balance: number;
  status: "Active" | "Follow-up" | "Inactive" | "New";
  color: string;
  dentistId: string;
}
export interface Dentist {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  experience: number;
  patients: number;
  appointments: number;
  revenue: number;
  availability: string;
  color: string;
}
export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  schedule: string;
  status: string;
}
export interface Appointment {
  id: string;
  patientId: string;
  dentistId: string;
  treatmentId: string;
  invoiceId?: string;
  date: string;
  time: string;
  duration: number;
  room: string;
  tooth: string;
  status: AppointmentStatus;
  notes: string;
}
export interface Treatment {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  cases: number;
  completed: number;
  status: string;
  description: string;
}
export interface TreatmentPlan {
  id: string;
  patientId: string;
  treatmentId: string;
  dentistId: string;
  tooth: string;
  date: string;
  status: string;
}
export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  dentistId: string;
  date: string;
  status: string;
}
export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}
export interface Invoice {
  id: string;
  patientId: string;
  treatmentId: string;
  date: string;
  due: string;
  items: InvoiceItem[];
  insurance: number;
  paid: number;
  status: string;
}
export interface Payment {
  id: string;
  patientId: string;
  invoiceId: string;
  method: string;
  amount: number;
  date: string;
  status: string;
}
export interface Message {
  id: string;
  patientId: string;
  body: string;
  direction: "in" | "out";
  channel: "SMS" | "Email";
  time: string;
  automated?: boolean;
}
export interface MedicalRecord {
  patientId: string;
  conditions: string[];
  allergies: string[];
  medications: string[];
  smoking: string;
  pregnancy: string;
  notes: string;
}
export interface PatientFile {
  id: string;
  patientId: string;
  name: string;
  category: string;
  date: string;
  size: string;
}
export interface Clinic {
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  timezone: string;
  currency: string;
}
export interface Activity {
  id: string;
  patientId: string;
  title: string;
  description: string;
  date: string;
  kind: "payment" | "appointment" | "treatment" | "file" | "patient";
}
export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  href: string;
}
