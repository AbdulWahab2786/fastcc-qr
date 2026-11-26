"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type AuthMode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!hasSupabaseEnv()) {
      setErrorMessage(
        "Supabase environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      );
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage("Enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setSuccessMessage(
        "Account created. Check your email to confirm your address, then sign in.",
      );
      setMode("signin");
      setPassword("");
    } catch {
      setErrorMessage("Unexpected error contacting authentication service.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 sm:p-8">
      <div className="mb-6">
        <span className="inline-flex items-center rounded-md border border-border bg-canvas-muted px-2 py-0.5 font-mono text-[11px] font-medium text-ink-muted">
          OPERATOR ACCESS
        </span>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-ink">
          {mode === "signin"
            ? "Sign in to Manager Dashboard"
            : "Create an Operator Account"}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {mode === "signin"
            ? "Manage your shop-floor QR codes, SOPs, and inspection logs."
            : "Save QR codes to your account and view live worker logs."}
        </p>
      </div>

      {/* Mode Switcher */}
      <div
        role="tablist"
        aria-label="Authentication mode"
        className="mb-6 grid grid-cols-2 rounded-lg border border-border bg-canvas-muted p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          onClick={() => {
            setMode("signin");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "signin"
              ? "bg-surface text-ink shadow-xs"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          onClick={() => {
            setMode("signup");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "signup"
              ? "bg-surface text-ink shadow-xs"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Sign Up
        </button>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2.5 rounded-lg border border-alert-red/30 bg-alert-red/5 px-3.5 py-2.5 text-xs text-alert-red"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          className="mb-4 flex items-start gap-2.5 rounded-lg border border-action-green/30 bg-action-green/5 px-3.5 py-2.5 text-xs text-action-green"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="auth-email"
            className="mb-1.5 block text-xs font-medium text-ink"
          >
            Work Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@company.com"
              className="w-full rounded-lg border border-border bg-surface py-2.5 pr-3 pl-9 text-sm text-ink placeholder:text-ink-muted/60 focus:border-utility-blue focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="auth-password"
            className="mb-1.5 block text-xs font-medium text-ink"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-surface py-2.5 pr-3 pl-9 text-sm text-ink placeholder:text-ink-muted/60 focus:border-utility-blue focus:outline-none"
            />
          </div>
          {mode === "signup" ? (
            <p className="mt-1 text-[11px] text-ink-muted">
              Minimum 6 characters.
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-action-green px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </span>
            </>
          ) : (
            <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-4 text-center text-xs text-ink-muted">
        Want to test first?{" "}
        <Link
          href="/"
          className="font-medium text-utility-blue hover:underline"
        >
          Generate a QR without signing in
        </Link>
      </div>
    </div>
  );
}
