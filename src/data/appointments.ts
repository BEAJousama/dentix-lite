import type { Appointment, AppointmentStatus } from "@/types";
/** The demo runs on a fixed clinic morning so every page tells the same story. */
export const DEMO_DATE = "2026-10-05";
export const DEMO_TIME = "09:20";
/** Each dentist works from their own room. */
const rooms: Record<string, string> = {
  "DEN-001": "Treatment Room 2",
  "DEN-002": "Treatment Room 1",
  "DEN-003": "Treatment Room 3",
  "DEN-004": "Treatment Room 4",
};
// [date, time, patientId, dentistId, treatmentId, tooth, duration, status, notes]
type Row = [
  string,
  string,
  string,
  string,
  string,
  string,
  number,
  AppointmentStatus,
  string,
];
// prettier-ignore
const week: Row[] = [
  // Monday, Oct 5 — today
  ["2026-10-05", "08:00", "PT-10439", "DEN-001", "TRT-003", "#46", 90, "In Treatment", "Second visit: obturation and temporary restoration."],
  ["2026-10-05", "08:30", "PT-10429", "DEN-002", "TRT-001", "—", 45, "Completed", "Six-month recall. Light calculus, no new concerns."],
  ["2026-10-05", "09:15", "PT-10438", "DEN-003", "TRT-004", "—", 45, "Checked In", "Interested in clear aligners. Bring photos from referral."],
  ["2026-10-05", "09:45", "PT-10432", "DEN-001", "TRT-007", "#24", 45, "Confirmed", "Replace fractured composite, mesial surface."],
  ["2026-10-05", "10:00", "PT-10431", "DEN-002", "TRT-001", "—", 45, "Confirmed", "Overdue balance — front desk to review before check-out."],
  ["2026-10-05", "10:45", "PT-10435", "DEN-001", "TRT-008", "#36", 60, "Confirmed", "Crown seat. Lab case received Friday."],
  ["2026-10-05", "10:45", "PT-10430", "DEN-002", "TRT-002", "—", 60, "Confirmed", "In-office whitening, session 1. Shade A3 recorded."],
  ["2026-10-05", "11:45", "PT-10432", "DEN-003", "TRT-004", "—", 45, "Confirmed", "Mild crowding, lower anterior."],
  ["2026-10-05", "12:00", "PT-10431", "DEN-001", "TRT-003", "#47", 45, "Confirmed", "Endodontic evaluation. Tender to percussion since last week."],
  ["2026-10-05", "12:30", "PT-10433", "DEN-002", "TRT-001", "—", 45, "Confirmed", ""],
  ["2026-10-05", "13:15", "PT-10429", "DEN-003", "TRT-004", "—", 45, "Scheduled", "Clear aligner consultation."],
  ["2026-10-05", "13:30", "PT-10433", "DEN-001", "TRT-007", "#37", 45, "Confirmed", "Occlusal caries found at recall."],
  ["2026-10-05", "14:00", "PT-10435", "DEN-002", "TRT-001", "—", 45, "Scheduled", ""],
  ["2026-10-05", "14:30", "PT-10438", "DEN-001", "TRT-007", "#15", 45, "Scheduled", ""],
  ["2026-10-05", "14:45", "PT-10430", "DEN-003", "TRT-004", "—", 45, "Scheduled", ""],
  ["2026-10-05", "15:30", "PT-10436", "DEN-001", "TRT-003", "#36", 60, "Scheduled", "Root canal, visit 1 of 2."],
  ["2026-10-05", "15:30", "PT-10434", "DEN-002", "TRT-001", "—", 45, "Scheduled", "New patient examination and full-mouth X-rays."],
  ["2026-10-05", "16:45", "PT-10434", "DEN-001", "TRT-007", "#26", 45, "Scheduled", ""],
  // Tuesday, Oct 6
  ["2026-10-06", "08:30", "PT-10436", "DEN-002", "TRT-001", "—", 45, "Confirmed", "Periodontal maintenance. Review home care."],
  ["2026-10-06", "09:00", "PT-10429", "DEN-001", "TRT-007", "#14", 45, "Confirmed", ""],
  ["2026-10-06", "09:30", "PT-10434", "DEN-003", "TRT-004", "—", 45, "Confirmed", ""],
  ["2026-10-06", "10:15", "PT-10435", "DEN-004", "TRT-006", "#18", 45, "Confirmed", "Partially erupted upper third molar."],
  ["2026-10-06", "11:00", "PT-10438", "DEN-002", "TRT-001", "—", 45, "Confirmed", ""],
  ["2026-10-06", "11:45", "PT-10439", "DEN-002", "TRT-001", "—", 45, "Scheduled", ""],
  ["2026-10-06", "13:00", "PT-10431", "DEN-001", "TRT-003", "#47", 90, "Scheduled", "Root canal, visit 1 of 2."],
  ["2026-10-06", "13:00", "PT-10433", "DEN-004", "TRT-005", "#46", 120, "Scheduled", "Implant placement. CBCT reviewed."],
  ["2026-10-06", "14:30", "PT-10432", "DEN-003", "TRT-004", "—", 60, "Scheduled", "Orthodontic records: scans and photos."],
  ["2026-10-06", "15:00", "PT-10430", "DEN-002", "TRT-002", "—", 60, "Scheduled", "In-office whitening, session 2."],
  // Wednesday, Oct 7
  ["2026-10-07", "08:30", "PT-10435", "DEN-002", "TRT-007", "#45", 45, "Confirmed", ""],
  ["2026-10-07", "09:00", "PT-10439", "DEN-001", "TRT-003", "#46", 30, "Confirmed", "Root canal post-op review."],
  ["2026-10-07", "09:30", "PT-10438", "DEN-003", "TRT-004", "—", 45, "Confirmed", "Intraoral scan for aligners."],
  ["2026-10-07", "10:00", "PT-10431", "DEN-004", "TRT-006", "#38", 45, "Scheduled", ""],
  ["2026-10-07", "10:30", "PT-10429", "DEN-002", "TRT-002", "—", 60, "Scheduled", ""],
  ["2026-10-07", "11:00", "PT-10436", "DEN-001", "TRT-003", "#36", 60, "Scheduled", "Root canal, visit 2 of 2."],
  ["2026-10-07", "13:30", "PT-10430", "DEN-004", "TRT-006", "#28", 45, "Scheduled", ""],
  ["2026-10-07", "14:00", "PT-10434", "DEN-002", "TRT-007", "#36", 45, "Scheduled", ""],
  ["2026-10-07", "14:30", "PT-10432", "DEN-001", "TRT-008", "#25", 60, "Scheduled", "Crown preparation and temporary."],
  // Thursday, Oct 8
  ["2026-10-08", "09:00", "PT-10433", "DEN-002", "TRT-002", "—", 60, "Scheduled", ""],
  ["2026-10-08", "09:30", "PT-10429", "DEN-001", "TRT-007", "#15", 45, "Scheduled", ""],
  ["2026-10-08", "10:00", "PT-10430", "DEN-003", "TRT-004", "—", 45, "Scheduled", "Aligner records."],
  ["2026-10-08", "10:30", "PT-10436", "DEN-004", "TRT-006", "#28", 45, "Scheduled", ""],
  ["2026-10-08", "11:00", "PT-10439", "DEN-001", "TRT-008", "#46", 60, "Scheduled", "Crown preparation after root canal."],
  ["2026-10-08", "13:00", "PT-10432", "DEN-002", "TRT-007", "#34", 45, "Scheduled", ""],
  ["2026-10-08", "14:30", "PT-10431", "DEN-001", "TRT-003", "#47", 60, "Scheduled", "Root canal, visit 2 of 2."],
  ["2026-10-08", "14:30", "PT-10437", "DEN-002", "TRT-001", "—", 45, "Cancelled", "Patient travelling. Will call to reschedule."],
  // Friday, Oct 9
  ["2026-10-09", "08:30", "PT-10438", "DEN-002", "TRT-007", "#24", 45, "Scheduled", ""],
  ["2026-10-09", "09:00", "PT-10436", "DEN-001", "TRT-008", "#36", 60, "Scheduled", "Crown preparation after root canal."],
  ["2026-10-09", "10:00", "PT-10433", "DEN-004", "TRT-005", "#46", 30, "Scheduled", "Implant post-op review."],
  ["2026-10-09", "11:00", "PT-10439", "DEN-002", "TRT-002", "—", 60, "Scheduled", ""],
  ["2026-10-09", "13:00", "PT-10429", "DEN-003", "TRT-004", "—", 45, "Scheduled", "Aligner treatment plan review."],
  // Saturday, Oct 10
  ["2026-10-10", "09:00", "PT-10432", "DEN-002", "TRT-001", "—", 45, "Scheduled", ""],
  ["2026-10-10", "09:30", "PT-10434", "DEN-003", "TRT-004", "—", 45, "Scheduled", ""],
  ["2026-10-10", "10:30", "PT-10435", "DEN-002", "TRT-001", "—", 45, "Scheduled", "Post-extraction check."],
];
export const appointments: Appointment[] = [
  {
    id: "APT-2042",
    patientId: "PT-10428",
    dentistId: "DEN-001",
    treatmentId: "TRT-003",
    invoiceId: "INV-2026-1048",
    date: "2026-10-06",
    time: "10:30",
    duration: 60,
    room: "Treatment Room 2",
    tooth: "#16",
    status: "Confirmed",
    notes:
      "Patient reported sensitivity over previous two weeks. Penicillin allergy on record.",
  },
  ...week.map(
    (
      [
        date,
        time,
        patientId,
        dentistId,
        treatmentId,
        tooth,
        duration,
        status,
        notes,
      ],
      i,
    ): Appointment => ({
      id: `APT-${2050 + i}`,
      patientId,
      dentistId,
      treatmentId,
      date,
      time,
      duration,
      room: rooms[dentistId],
      tooth,
      status,
      notes,
    }),
  ),
];
