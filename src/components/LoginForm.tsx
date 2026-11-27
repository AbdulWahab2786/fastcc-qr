"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { validateAuthEmail } from "@/lib/auth/email-guard";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type AuthMode = "signin" | "otp";

const OTP_RESEND_COOLDOWN_SECONDS = 30;

interface LoginFormProps {
  nextPath?: string;
  initialError?: string;
}

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.09.73-2.48 1.16-4.22 1.16-3.24 0-5.99-2.19-6.97-5.13H1.04v3.14C3.05 21.15 7.21 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.03 14.02A7.18 7.18 0 0 1 4.65 12c0-.7.13-1.39.38-2.02V6.84H1.04A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.04 5.16l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.8 0 3.41.62 4.68 1.83l3.51-3.51C18.07 1.19 15.3 0 12 0 7.21 0 3.05 2.85 1.04 6.84l3.99 3.14C6.01 6.94 8.76 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function LoginForm({
  nextPath = "/dashboard",
  initialError,
}: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpSentTo, setOtpSentTo] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialError ?? null,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isCoolingDown = resendCooldown > 0;

  useEffect(() => {
    if (!isCoolingDown) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isCoolingDown]);

  function resetMessages() {
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    resetMessages();
    if (nextMode === "signin") {
      setOtpSentTo(null);
      setOtpToken("");
    }
  }

  function ensureSupabaseReady(): boolean {
    if (hasSupabaseEnv()) {
      return true;
    }
    setErrorMessage(
      "Supabase environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
    return false;
  }

  async function handleGoogleSignIn() {
    resetMessages();
    if (!ensureSupabaseReady()) {
      return;
    }

    setIsGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsGoogleLoading(false);
      }
    } catch {
      setErrorMessage("Unexpected error contacting Google authentication.");
      setIsGoogleLoading(false);
    }
  }

  async function sendOtpCode(targetEmail: string) {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: targetEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setOtpSentTo(targetEmail);
      setEmail(targetEmail);
      setOtpToken("");
      setResendCooldown(OTP_RESEND_COOLDOWN_SECONDS);
      setSuccessMessage(
        `We sent a 6-digit verification code to ${targetEmail}.`,
      );
    } catch {
      setErrorMessage("Unexpected error sending verification code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordSignIn(normalizedEmail: string) {
    if (!password) {
      setErrorMessage("Enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setErrorMessage("Unexpected error contacting authentication service.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp(targetEmail: string) {
    const cleanToken = otpToken.trim();
    if (!/^\d{6}$/.test(cleanToken)) {
      setErrorMessage("Enter the 6-digit verification code from your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email: targetEmail,
        token: cleanToken,
        type: "email",
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setErrorMessage("Unexpected error verifying your code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (!ensureSupabaseReady()) {
      return;
    }

    if (mode === "otp" && otpSentTo) {
      await handleVerifyOtp(otpSentTo);
      return;
    }

    const emailCheck = validateAuthEmail(email);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error);
      return;
    }

    if (mode === "signin") {
      await handlePasswordSignIn(emailCheck.normalizedEmail);
      return;
    }

    await sendOtpCode(emailCheck.normalizedEmail);
  }

  async function handleResendOtp() {
    if (!otpSentTo || isCoolingDown || isSubmitting) {
      return;
    }

    resetMessages();
    if (!ensureSupabaseReady()) {
      return;
    }

    const emailCheck = validateAuthEmail(otpSentTo);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error);
      return;
    }

    await sendOtpCode(emailCheck.normalizedEmail);
  }

  const isBusy = isSubmitting || isGoogleLoading;

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fastcc-logo.png"
            alt="FastCC QR"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md border border-border bg-white object-contain p-0.5"
          />
          <span className="inline-flex items-center rounded-md border border-border bg-canvas-muted px-2 py-0.5 font-mono text-[11px] font-medium text-ink-muted">
            OPERATOR ACCESS
          </span>
        </div>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-ink">
          {mode === "signin"
            ? "Sign in to Manager Dashboard"
            : "Sign up with Verified Email"}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {mode === "signin"
            ? "Manage your shop-floor QR codes, SOPs, and inspection logs."
            : "Create or access your account with a 6-digit email verification code."}
        </p>
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isBusy}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-xs transition-colors hover:bg-canvas-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-ink-muted" />
            <span>Redirecting to Google...</span>
          </>
        ) : (
          <>
            <GoogleMark />
            <span>Continue with Google</span>
          </>
        )}
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink-muted">
          OR
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Mode Switcher */}
      <div
        role="tablist"
        aria-label="Authentication mode"
        className="mb-5 grid grid-cols-2 rounded-lg border border-border bg-canvas-muted p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          disabled={isBusy}
          onClick={() => switchMode("signin")}
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
          aria-selected={mode === "otp"}
          disabled={isBusy}
          onClick={() => switchMode("otp")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "otp"
              ? "bg-surface text-ink shadow-xs"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Sign Up (OTP)
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
        {mode === "otp" && otpSentTo ? (
          <div>
            <div className="mb-3 flex items-center justify-between rounded-lg border border-border bg-canvas-muted px-3 py-2 text-xs">
              <span className="truncate font-medium text-ink">{otpSentTo}</span>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  setOtpSentTo(null);
                  setOtpToken("");
                  resetMessages();
                }}
                className="ml-2 shrink-0 font-medium text-utility-blue hover:underline"
              >
                Change
              </button>
            </div>

            <label
              htmlFor="auth-otp"
              className="mb-1.5 block text-xs font-medium text-ink"
            >
              6-Digit Verification Code
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                id="auth-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                pattern="\d{6}"
                value={otpToken}
                onChange={(e) =>
                  setOtpToken(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                className="w-full rounded-lg border border-border bg-surface py-2.5 pr-3 pl-9 font-mono text-sm tracking-[0.3em] text-ink placeholder:tracking-normal placeholder:text-ink-muted/60 focus:border-utility-blue focus:outline-none"
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-ink-muted">
                Check spam if it doesn&apos;t arrive.
              </span>
              <button
                type="button"
                disabled={isCoolingDown || isBusy}
                onClick={handleResendOtp}
                className="font-medium text-utility-blue hover:underline disabled:cursor-not-allowed disabled:text-ink-muted disabled:no-underline"
              >
                {isCoolingDown
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
            </div>
          </div>
        ) : (
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
            {mode === "otp" ? (
              <p className="mt-1 text-[11px] text-ink-muted">
                Disposable emails and +aliases are blocked. We&apos;ll send a
                6-digit code.
              </p>
            ) : null}
          </div>
        )}

        {mode === "signin" ? (
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-surface py-2.5 pr-3 pl-9 text-sm text-ink placeholder:text-ink-muted/60 focus:border-utility-blue focus:outline-none"
              />
            </div>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isBusy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-action-green px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {mode === "signin"
                  ? "Signing in..."
                  : otpSentTo
                    ? "Verifying code..."
                    : "Sending verification code..."}
              </span>
            </>
          ) : (
            <span>
              {mode === "signin"
                ? "Sign In"
                : otpSentTo
                  ? "Verify & Continue"
                  : "Send Verification Code"}
            </span>
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
