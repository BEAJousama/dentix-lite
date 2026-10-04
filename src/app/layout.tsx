import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "./globals.css";
import { Providers } from "@/components/dentix/providers";
export const metadata: Metadata = {
  title: {
    default: "Dentix Lite — Dental Practice Management",
    template: "%s | Dentix",
  },
  description:
    "Dental care, beautifully organized. A free Next.js dental clinic dashboard by Dentix.",
  // Clinic workspaces stay out of search engines. Set DENTIX_ALLOW_INDEXING=true
  // only for a public demo you want indexed.
  robots:
    process.env.DENTIX_ALLOW_INDEXING === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
