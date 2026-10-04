import type { Message, Clinic, Notification } from "@/types";
export const messages: Message[] = [
  {
    id: "MSG-1",
    patientId: "PT-10428",
    body: "Hi Sarah, this is a reminder that your root canal appointment with Dr. Harris is scheduled for Tuesday, Oct 6 at 10:30 AM.",
    direction: "out",
    channel: "SMS",
    time: "09:30 AM",
    automated: true,
  },
  {
    id: "MSG-2",
    patientId: "PT-10428",
    body: "Thanks! I’ll be there.",
    direction: "in",
    channel: "SMS",
    time: "09:42 AM",
  },
  {
    id: "MSG-3",
    patientId: "PT-10429",
    body: "Is there anything I need to bring to my aligner consultation this afternoon?",
    direction: "in",
    channel: "SMS",
    time: "08:45 AM",
  },
  {
    id: "MSG-4",
    patientId: "PT-10430",
    body: "Thanks for the reminder — see you at 10:45 for my whitening!",
    direction: "in",
    channel: "Email",
    time: "Yesterday",
  },
];
export const clinic: Clinic = {
  name: "Dentix Dental Clinic",
  phone: "(415) 555-0100",
  email: "hello@dentix.example.com",
  website: "dentix.example.com",
  address: "123 Market Street, San Francisco, CA 94103",
  timezone: "America/Los_Angeles",
  currency: "USD",
};
export const notifications: Notification[] = [
  {
    id: "N1",
    title: "Mia Clark has checked in",
    body: "Braces consultation · Treatment Room 3",
    read: false,
    href: "/appointments",
  },
  {
    id: "N2",
    title: "Payment received",
    body: "Michael Chen paid $120 by card.",
    read: false,
    href: "/payments",
  },
  {
    id: "N3",
    title: "Tomorrow’s schedule is ready",
    body: "Review your upcoming appointments.",
    read: false,
    href: "/appointments",
  },
];
export const revenueData = [
  28400, 31200, 29800, 36400, 39100, 42800, 40900, 46300, 48700, 51200, 53800,
  57400,
].map((revenue, i) => ({
  name: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][i],
  revenue,
  expenses: Math.round(revenue * 0.43 + (i % 3) * 1200),
}));
