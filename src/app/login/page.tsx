"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Stethoscope,
  CalendarDays,
  Check,
} from "lucide-react";
import { Button, Field, Logo, Modal } from "@/components/ui/primitives";
export default function Login() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [reset, setReset] = useState(false);
  return (
    <main className="login-page" id="main-content">
      <section className="login-brand">
        <Logo />
        <div className="login-story">
          <span className="eyebrow">
            A LITTLE CLARITY. A BETTER DAY OF CARE.
          </span>
          <h1>
            Dental care,
            <br />
            beautifully
            <br />
            <em>organized.</em>
          </h1>
          <p>
            More time for your patients.
            <br />A little less on your mind.
          </p>
          <div className="login-visual">
            <div className="login-orbit orbit-one" />
            <div className="login-orbit orbit-two" />
            <div className="login-symbol">
              <Stethoscope size={70} strokeWidth={1} />
            </div>
            <span className="login-float float-one">
              <CalendarDays size={20} />
              <span>
                <strong>Your day, in harmony.</strong>
                <small>Appointments beautifully in sync</small>
              </span>
              <Check size={15} />
            </span>
            <span className="login-float float-two">
              <ShieldCheck size={22} />
              <span>
                <strong>Care that’s connected.</strong>
                <small>Every patient. Every detail.</small>
              </span>
            </span>
          </div>
        </div>
        <span className="login-copyright">
          © 2026 Dentix · A more thoughtful practice.
        </span>
      </section>
      <section className="login-form-panel">
        <div className="login-mobile-brand">
          <Logo />
        </div>
        <div className="login-form">
          <span className="eyebrow">YOUR CLINIC AWAITS</span>
          <h2>Welcome back.</h2>
          <p>A great day of care starts here.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/dashboard");
            }}
          >
            <Field label="Email address">
              <input
                type="email"
                defaultValue="olivia.carter@example.com"
                required
                autoComplete="username"
              />
            </Field>
            <Field label="Password">
              <div className="password-field">
                <input
                  type={visible ? "text" : "password"}
                  defaultValue="dentix-demo"
                  minLength={6}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={visible ? "Hide password" : "Show password"}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </Field>
            <div className="login-options">
              <label>
                <input type="checkbox" defaultChecked />
                Remember me
              </label>
              <button type="button" onClick={() => setReset(true)}>
                Forgot password?
              </button>
            </div>
            <Button variant="primary" type="submit">
              Sign in to your clinic <ArrowRight size={16} />
            </Button>
          </form>
          <div className="login-demo">
            <span>
              <ShieldCheck size={18} />
              <strong>A little look inside Dentix</strong>
            </span>
            <p>
              This is a fictional demo workspace. Use the pre-filled details or
              any valid email and a password of 6+ characters.
            </p>
            <small>No real authentication or patient information.</small>
          </div>
          <div className="login-legal">
            Designed with care. Built for your practice.
          </div>
        </div>
      </section>
      <Modal
        open={reset}
        onClose={() => setReset(false)}
        title="You’re in a demo workspace"
        description="No password reset is needed."
      >
        <div className="dialog-body stack">
          <p className="muted">
            Use any valid email address and a password with at least 6
            characters to explore Dentix. Authentication can be connected to
            your own backend.
          </p>
          <Button variant="primary" onClick={() => setReset(false)}>
            Back to sign in
          </Button>
        </div>
      </Modal>
    </main>
  );
}
