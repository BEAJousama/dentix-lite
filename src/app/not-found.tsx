import Link from "next/link";
import { Logo } from "@/components/ui/primitives";
export default function NotFound() {
  return (
    <main id="main-content" className="error-state full-page">
      <Logo />
      <span className="error-code">404</span>
      <h1>A little off the chart.</h1>
      <p>The page you’re looking for isn’t in this workspace.</p>
      <Link className="btn btn-primary" href="/dashboard">
        Return to dashboard
      </Link>
    </main>
  );
}
