import type { Invoice, Payment } from "@/types";
export const invoices: Invoice[] = [
  {
    id: "INV-2026-1048",
    patientId: "PT-10428",
    treatmentId: "TRT-003",
    date: "2026-10-06",
    due: "2026-10-20",
    items: [
      {
        description: "Root Canal Therapy · Tooth #16",
        quantity: 1,
        price: 620,
      },
    ],
    insurance: 0,
    paid: 0,
    status: "Pending",
  },
  {
    id: "INV-2026-1047",
    patientId: "PT-10429",
    treatmentId: "TRT-001",
    date: "2026-04-09",
    due: "2026-04-23",
    items: [
      {
        description: "Periodic examination and bitewing X-rays",
        quantity: 1,
        price: 120,
      },
    ],
    insurance: 0,
    paid: 120,
    status: "Paid",
  },
  {
    id: "INV-2026-1046",
    patientId: "PT-10430",
    treatmentId: "TRT-001",
    date: "2026-09-02",
    due: "2026-09-16",
    items: [
      {
        description: "Sensitivity review and fluoride varnish",
        quantity: 1,
        price: 180,
      },
    ],
    insurance: 0,
    paid: 0,
    status: "Overdue",
  },
  {
    id: "INV-2026-1045",
    patientId: "PT-10431",
    treatmentId: "TRT-006",
    date: "2026-09-10",
    due: "2026-09-24",
    items: [
      {
        description: "Surgical extraction · Tooth #48",
        quantity: 1,
        price: 280,
      },
      { description: "Panoramic X-ray", quantity: 1, price: 140 },
    ],
    insurance: 0,
    paid: 0,
    status: "Overdue",
  },
  {
    id: "INV-2026-1044",
    patientId: "PT-10432",
    treatmentId: "TRT-001",
    date: "2026-07-21",
    due: "2026-08-04",
    items: [
      {
        description: "Dental cleaning and examination",
        quantity: 1,
        price: 120,
      },
    ],
    insurance: 0,
    paid: 120,
    status: "Paid",
  },
  {
    id: "INV-2026-1043",
    patientId: "PT-10433",
    treatmentId: "TRT-007",
    date: "2026-09-24",
    due: "2026-10-08",
    items: [
      { description: "Composite filling · Tooth #36", quantity: 1, price: 240 },
    ],
    insurance: 0,
    paid: 240,
    status: "Paid",
  },
  {
    id: "INV-2026-1042",
    patientId: "PT-10434",
    treatmentId: "TRT-001",
    date: "2026-09-29",
    due: "2026-10-13",
    items: [
      { description: "New patient consultation", quantity: 1, price: 120 },
    ],
    insurance: 0,
    paid: 120,
    status: "Paid",
  },
  {
    id: "INV-2026-1041",
    patientId: "PT-10435",
    treatmentId: "TRT-007",
    date: "2026-09-08",
    due: "2026-09-22",
    items: [
      { description: "Composite filling · Tooth #26", quantity: 1, price: 240 },
    ],
    insurance: 0,
    paid: 0,
    status: "Overdue",
  },
  {
    id: "INV-2026-1040",
    patientId: "PT-10436",
    treatmentId: "TRT-001",
    date: "2026-09-16",
    due: "2026-09-30",
    items: [
      {
        description: "Scaling and root planing · 2 quadrants",
        quantity: 1,
        price: 380,
      },
    ],
    insurance: 0,
    paid: 0,
    status: "Overdue",
  },
  {
    id: "INV-2026-1039",
    patientId: "PT-10437",
    treatmentId: "TRT-001",
    date: "2026-02-03",
    due: "2026-02-17",
    items: [
      {
        description: "Dental cleaning and examination",
        quantity: 1,
        price: 120,
      },
    ],
    insurance: 0,
    paid: 120,
    status: "Paid",
  },
  {
    id: "INV-2026-1038",
    patientId: "PT-10438",
    treatmentId: "TRT-001",
    date: "2026-09-22",
    due: "2026-10-06",
    items: [
      { description: "New patient consultation", quantity: 1, price: 120 },
    ],
    insurance: 0,
    paid: 120,
    status: "Paid",
  },
  {
    id: "INV-2026-0994",
    patientId: "PT-10428",
    treatmentId: "TRT-001",
    date: "2026-08-12",
    due: "2026-08-26",
    items: [
      {
        description: "Dental cleaning and examination",
        quantity: 1,
        price: 180,
      },
    ],
    insurance: 0,
    paid: 180,
    status: "Paid",
  },
  {
    id: "INV-2026-0880",
    patientId: "PT-10428",
    treatmentId: "TRT-007",
    date: "2026-06-07",
    due: "2026-06-21",
    items: [
      { description: "Restorative treatment course", quantity: 1, price: 2420 },
    ],
    insurance: 740,
    paid: 1680,
    status: "Paid",
  },
];
export const payments: Payment[] = invoices
  .filter((i) => i.paid > 0)
  .map((i, n) => ({
    id: `PAY-${3050 + n}`,
    patientId: i.patientId,
    invoiceId: i.id,
    method: ["Card", "Insurance", "Cash", "Bank transfer"][n % 4],
    amount: i.paid,
    date:
      i.patientId === "PT-10428" && i.id === "INV-2026-0994"
        ? "2026-08-22"
        : i.date,
    status: "Completed",
  }));
