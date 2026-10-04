import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
export const cn = (...v: ClassValue[]) => twMerge(clsx(v));
export const money = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
export const dateLabel = (s: string, pattern = "MMM d, yyyy") =>
  s === "TBD" ? s : format(parseISO(s), pattern);
export function downloadText(
  name: string,
  content: string,
  type = "text/plain",
) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
