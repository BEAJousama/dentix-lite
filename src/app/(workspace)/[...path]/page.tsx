import { notFound } from "next/navigation";
import { ProFeature } from "@/components/dentix/pro-feature";
import { proFeatures } from "@/lib/pro";
import { patients } from "@/data/patients";
import { dentists } from "@/data/dentists";
import { invoices } from "@/data/invoices";
import { treatments } from "@/data/treatments";

// Only these Pro preview URLs exist; anything else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  const settings = [
    "clinic",
    "team",
    "appointments",
    "treatments",
    "billing",
    "notifications",
    "branding",
    "security",
  ];
  return [
    ...Object.keys(proFeatures).map((key) => [key]),
    ...patients.map((p) => ["patients", p.slug]),
    ...dentists.map((d) => ["dentists", d.slug]),
    ...invoices.map((i) => ["invoices", i.id]),
    ...treatments.map((t) => ["treatments", t.id]),
    ...settings.map((s) => ["settings", s]),
  ].map((path) => ({ path }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  return { title: proFeatures[path[0]]?.title ?? "Not found" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  // "patients" alone is the Lite directory, so only patients/<slug> lands here.
  if (!proFeatures[path[0]]) notFound();
  return <ProFeature path={path} />;
}
