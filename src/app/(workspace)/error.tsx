"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/primitives";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="error-state">
      <span>
        <AlertTriangle size={30} />
      </span>
      <h1>Let’s try that again.</h1>
      <p>We couldn’t load this workspace. Your session is still here.</p>
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
