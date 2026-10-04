"use client";
import { Toaster } from "sonner";
import { ClinicProvider } from "@/hooks/use-clinic";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClinicProvider>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{ style: { fontSize: 12, borderRadius: 10 } }}
      />
    </ClinicProvider>
  );
}
