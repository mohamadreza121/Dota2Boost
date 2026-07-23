"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

type AuthMode = "sign-in" | "register";
type Audience = "Customer" | "Booster" | "Admin";

const fieldClass = "auth-modal__field";

export function AuthModal({
  open,
  onClose,
  initialMode = "sign-in"
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [audience, setAudience] = useState<Audience>("Customer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("input, button")?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose, open]);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setRegistered(false);
  }

  async function submitSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? "")
      });
      if (authError) throw authError;
      const destination = audience === "Booster" ? "/coach" : audience === "Admin" ? "/admin" : "/dashboard";
      onClose();
      router.push(destination);
      router.refresh();
    } catch {
      setError("Sign-in failed. Check your email and password, then try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    if (form.get("agree") !== "on") {
      setError("Accept the platform policies before creating an account.");
      setBusy(false);
      return;
    }
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { display_name: String(form.get("displayName") ?? "").trim() }
        }
      });
      if (authError) throw authError;
      if (data.session) {
        onClose();
        router.push("/dashboard");
        router.refresh();
      } else {
        setRegistered(true);
      }
    } catch {
      setError("Account creation failed. Check the details and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="auth-modal" role="presentation">
      <button type="button" className="auth-modal__scrim" aria-label="Close account dialog" onClick={onClose} />
      <div ref={dialogRef} className="auth-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button type="button" className="auth-modal__close" aria-label="Close account dialog" onClick={onClose}><X /></button>
        <div className="auth-modal__crest"><LockKeyhole /></div>
        <p className="auth-modal__eyebrow">Secure player access</p>
        <h2 id="auth-modal-title">{mode === "sign-in" ? "Enter your workspace." : "Create your workspace."}</h2>
        <p className="auth-modal__intro">{mode === "sign-in" ? "Continue without leaving the current page." : "Registration creates customer accounts only."}</p>

        <div className="auth-modal__mode-tabs" role="tablist" aria-label="Account action">
          <button type="button" role="tab" aria-selected={mode === "sign-in"} onClick={() => switchMode("sign-in")}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => switchMode("register")}>Register</button>
        </div>

        {error ? <p className="auth-modal__error" role="alert">{error}</p> : null}

        {registered ? (
          <div className="auth-modal__success">
            <CheckCircle2 />
            <strong>Check your inbox.</strong>
            <p>Use the verification link we sent to activate your customer account.</p>
            <button type="button" onClick={() => switchMode("sign-in")}>Return to sign in</button>
          </div>
        ) : mode === "sign-in" ? (
          <>
            <div className="auth-modal__audiences">
              {(["Customer", "Booster", "Admin"] as const).map((option) => <button key={option} type="button" data-active={audience === option} onClick={() => setAudience(option)}>{option}</button>)}
            </div>
            <form onSubmit={submitSignIn} className="auth-modal__form">
              <label>Email<input className={fieldClass} name="email" type="email" autoComplete="email" required /></label>
              <label>Password<input className={fieldClass} name="password" type="password" autoComplete="current-password" minLength={8} required /></label>
              <div className="auth-modal__form-row"><Link href="/auth/forgot-password" onClick={onClose}>Forgot password?</Link></div>
              <button className="auth-modal__submit" disabled={busy}>{busy ? <><LoaderCircle className="animate-spin" />Signing in</> : "Sign in securely"}</button>
            </form>
            {audience === "Customer" ? <p className="auth-modal__switch">New here? <button type="button" onClick={() => switchMode("register")}>Create a customer account</button></p> : <p className="auth-modal__notice">{audience} accounts are invitation-only.</p>}
          </>
        ) : (
          <form onSubmit={submitRegistration} className="auth-modal__form">
            <label>Display name<input className={fieldClass} name="displayName" autoComplete="name" minLength={2} maxLength={60} required /></label>
            <label>Email<input className={fieldClass} name="email" type="email" autoComplete="email" required /></label>
            <label>Password<input className={fieldClass} name="password" type="password" autoComplete="new-password" minLength={10} required /><small>Use at least 10 characters.</small></label>
            <label className="auth-modal__agreement"><input type="checkbox" name="agree" required /><span>I agree to the platform policies and understand that account credentials must never be shared.</span></label>
            <button className="auth-modal__submit" disabled={busy}>{busy ? <><LoaderCircle className="animate-spin" />Creating account</> : "Create customer account"}</button>
            <p className="auth-modal__notice"><ShieldCheck /> Booster and staff accounts remain invitation-only.</p>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
