"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { PaidPlanTier } from "@/lib/billing/constants";
import type { PlanTier } from "@/types/database";

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    email?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (resp: { error?: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

interface PricingClientProps {
  isAuthenticated: boolean;
  currentPlan: PlanTier;
  userEmail: string;
}

let razorpayScriptPromise: Promise<boolean> | null = null;

function loadRazorpayCheckoutScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(Boolean(window.Razorpay));
      script.onerror = () => {
        razorpayScriptPromise = null;
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
}

const TIERS: {
  id: PlanTier;
  name: string;
  price: string;
  period: string;
  tagline: string;
  badge?: string;
  features: string[];
}[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "/mo",
    tagline: "Zero-friction start for small workshops and trials.",
    features: [
      "Up to 10 QR codes",
      "1 AI SOP trial",
      "FastCC watermark on stickers",
      "Mobile worker view & scan counter",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹999",
    period: "/mo",
    tagline: "For active SMB shop floors, D2C packing lines, and QA teams.",
    badge: "Most Popular",
    features: [
      "Unlimited QR codes",
      "30 AI SOPs / month",
      "No Watermark + Custom Logo",
      "CSV Export & Photo Proof",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "₹2,999",
    period: "/mo",
    tagline: "Built for multi-site plants, warehouses, and high-volume audits.",
    features: [
      "Unlimited QR codes & AI SOPs",
      "Multi-site operations",
      "Priority support",
      "No Watermark, Custom Logo & CSV Export",
    ],
  },
];

export function PricingClient({
  isAuthenticated,
  currentPlan,
  userEmail,
}: PricingClientProps) {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<PaidPlanTier | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleUpgrade(plan: PaidPlanTier) {
    setErrorMessage(null);

    if (!isAuthenticated) {
      router.push("/login?next=/pricing");
      return;
    }

    setLoadingPlan(plan);

    try {
      const [scriptLoaded, orderRes] = await Promise.all([
        loadRazorpayCheckoutScript(),
        fetch("/api/billing/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        }),
      ]);

      const orderBody = (await orderRes.json()) as {
        orderId?: string;
        amount?: number;
        currency?: string;
        key?: string;
        error?: string;
      };

      if (!orderRes.ok || !orderBody.orderId || !orderBody.key) {
        setErrorMessage(
          orderBody.error || "Could not initialize Razorpay checkout order.",
        );
        setLoadingPlan(null);
        return;
      }

      if (!scriptLoaded || !window.Razorpay) {
        setErrorMessage(
          "Failed to load Razorpay Checkout script. Check your internet connection and retry.",
        );
        setLoadingPlan(null);
        return;
      }

      const rzp = new window.Razorpay({
        key: orderBody.key,
        amount: orderBody.amount ?? (plan === "pro" ? 99900 : 299900),
        currency: orderBody.currency ?? "INR",
        name: "FastCC QR",
        description:
          plan === "pro"
            ? "Pro Plan — 30 Days"
            : "Business Plan — 30 Days",
        order_id: orderBody.orderId,
        prefill: userEmail ? { email: userEmail } : undefined,
        theme: { color: "#16A34A" },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
          },
        },
        handler: async (paymentResponse) => {
          try {
            const verifyRes = await fetch("/api/billing/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...paymentResponse,
                plan,
              }),
            });

            const verifyBody = (await verifyRes.json()) as {
              success?: boolean;
              error?: string;
            };

            if (!verifyRes.ok || !verifyBody.success) {
              setErrorMessage(
                verifyBody.error ||
                  "Payment captured, but plan verification failed. Contact support.",
              );
              setLoadingPlan(null);
              return;
            }

            router.push("/dashboard?upgraded=true");
            router.refresh();
          } catch {
            setErrorMessage(
              "Network error while verifying Razorpay payment. Please refresh your dashboard.",
            );
            setLoadingPlan(null);
          }
        },
      });

      rzp.on("payment.failed", (evt) => {
        setErrorMessage(
          evt.error?.description || "Razorpay payment failed. Please try again.",
        );
        setLoadingPlan(null);
      });

      rzp.open();
    } catch {
      setErrorMessage(
        "Unexpected error starting Razorpay checkout. Please try again.",
      );
      setLoadingPlan(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs font-medium text-ink-muted">
          <Sparkles className="h-3.5 w-3.5 text-action-green" />
          TRANSPARENT INR PRICING
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Industrial QR &amp; AI SOP Plans
        </h1>
        <p className="mt-2 text-sm text-ink-muted sm:text-base">
          Start free on the shop floor. Upgrade when your operations need
          watermark-free labels, custom branding, and higher AI SOP volume.
        </p>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="mx-auto mt-6 flex max-w-3xl items-start gap-2.5 rounded-lg border border-alert-red/30 bg-alert-red/5 px-4 py-3 text-xs text-alert-red"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const isPopular = tier.id === "pro";
          const isCurrent = isAuthenticated && currentPlan === tier.id;
          const isLoading = loadingPlan === tier.id;

          return (
            <section
              key={tier.id}
              className={`flex flex-col justify-between rounded-xl bg-surface p-6 ${
                isPopular
                  ? "border-2 border-action-green"
                  : "border border-border"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-ink">
                    {tier.name}
                  </h2>
                  {tier.badge ? (
                    <span className="rounded-md border border-action-green/30 bg-action-green/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-action-green">
                      {tier.badge}
                    </span>
                  ) : isCurrent ? (
                    <span className="rounded-md border border-border bg-canvas-muted px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-ink-muted">
                      Current Plan
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-bold tracking-tight text-ink">
                    {tier.price}
                  </span>
                  <span className="text-sm font-medium text-ink-muted">
                    {tier.period}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                  {tier.tagline}
                </p>

                <ul className="mt-6 space-y-3 border-t border-border pt-5">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-ink"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-action-green" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                {tier.id === "free" ? (
                  isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-canvas-muted px-4 text-sm font-semibold text-ink transition-colors hover:bg-border/50"
                    >
                      {isCurrent ? "Current Plan • Dashboard" : "Go to Dashboard"}
                    </Link>
                  ) : (
                    <Link
                      href="/login?next=/pricing"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:bg-canvas-muted"
                    >
                      Get Started Free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )
                ) : (
                  <button
                    type="button"
                    disabled={loadingPlan !== null || isCurrent}
                    onClick={() => handleUpgrade(tier.id as PaidPlanTier)}
                    className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-60 ${
                      isPopular
                        ? "bg-action-green text-white hover:opacity-95"
                        : "bg-ink text-white hover:opacity-90"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Opening Checkout...</span>
                      </>
                    ) : isCurrent ? (
                      <span>Active {tier.name} Plan</span>
                    ) : (
                      <>
                        <span>
                          {tier.id === "pro"
                            ? "Upgrade to Pro"
                            : "Upgrade to Business"}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-muted">
        <ShieldCheck className="h-4 w-4 text-action-green" />
        <span>
          Secured by Razorpay INR Checkout • Instant activation for 30 days • No
          hidden per-seat fees.
        </span>
      </div>
    </main>
  );
}
