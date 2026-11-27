"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Check,
  HelpCircle,
  Loader2,
  Minus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  FREE_AI_SOP_LIMIT,
  FREE_QR_LIMIT,
  PLAN_SPECS,
  PRO_AI_SOP_LIMIT,
  type PaidPlanTier,
} from "@/lib/billing/constants";
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

function formatInrPrice(priceInr: number): string {
  return `₹${priceInr.toLocaleString("en-IN")}`;
}

const FREE_QR_CAP = PLAN_SPECS.free.qrLimit ?? FREE_QR_LIMIT;
const FREE_AI_CAP = PLAN_SPECS.free.aiSopLimit ?? FREE_AI_SOP_LIMIT;
const PRO_AI_CAP = PLAN_SPECS.pro.aiSopLimit ?? PRO_AI_SOP_LIMIT;

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
    id: PLAN_SPECS.free.id,
    name: PLAN_SPECS.free.name,
    price: formatInrPrice(PLAN_SPECS.free.priceInr),
    period: "/mo",
    tagline: "Zero-friction start for small workshops, kitchens, and pilot trials.",
    features: [
      `Up to ${FREE_QR_CAP} permanent QR codes (${FREE_AI_CAP} AI SOP trial)`,
      "Live GPS photo watermark (date, time & coords)",
      "Worker digital signatures & 5-language view (EN, HI, TE, MR, TA)",
      "1-click industry templates & WhatsApp Faulty alerts",
      "A4 sticker print sheets & Audit PDF/CSV export (with FastCC watermark)",
    ],
  },
  {
    id: PLAN_SPECS.pro.id,
    name: PLAN_SPECS.pro.name,
    price: formatInrPrice(PLAN_SPECS.pro.priceInr),
    period: "/mo",
    tagline: "For active SMB shop floors, cloud kitchens, and QA audit teams.",
    badge: "Most Popular",
    features: [
      `Unlimited QR codes & scans (${PRO_AI_CAP} AI SOPs / month)`,
      "Unbranded A4 sticker sheets & Audit PDFs (no FastCC watermark)",
      "Custom company logo & colors on QR labels",
      "Location / Site folders for organizing floors & rooms",
      "Inspection schedules (Daily / Weekly / Monthly) & overdue tracking",
    ],
  },
  {
    id: PLAN_SPECS.business.id,
    name: PLAN_SPECS.business.name,
    price: formatInrPrice(PLAN_SPECS.business.priceInr),
    period: "/mo",
    tagline: "Built for multi-site plants, warehouses, and high-volume rollouts.",
    features: [
      "Unlimited QR codes, scans & AI SOPs",
      "CSV Bulk QR Generator (import 50–100+ machines at once)",
      "Multi-site / Branch folder management & bulk A4 print",
      "Unbranded Audit PDFs, CSV logs & custom logo",
      "Priority support for plant & warehouse onboarding",
    ],
  },
];

type MatrixCell = string | boolean;

const COMPARISON_MATRIX: {
  feature: string;
  free: MatrixCell;
  pro: MatrixCell;
  business: MatrixCell;
}[] = [
  {
    feature: "Permanent Operational QR Codes",
    free: `Up to ${FREE_QR_CAP}`,
    pro: "Unlimited",
    business: "Unlimited",
  },
  {
    feature: "AI Video-to-SOP & Paper-to-Form",
    free: `${FREE_AI_CAP} trial`,
    pro: `${PRO_AI_CAP} / month`,
    business: "Unlimited",
  },
  {
    feature: "Anti-Fake Live Camera + GPS Watermark",
    free: true,
    pro: true,
    business: true,
  },
  {
    feature: "Worker Digital Signatures",
    free: true,
    pro: true,
    business: true,
  },
  {
    feature: "5-Language Worker View (EN, हिन्दी, తెలుగు, मराठी, தமிழ்)",
    free: true,
    pro: true,
    business: true,
  },
  {
    feature: "1-Click Industry Templates & WhatsApp Faulty Alerts",
    free: true,
    pro: true,
    business: true,
  },
  {
    feature: "A4 Bulk Sticker Print (8 / 12 / 16 per page)",
    free: "With FastCC watermark",
    pro: "Unbranded (No watermark)",
    business: "Unbranded (No watermark)",
  },
  {
    feature: "FSSAI / ISO Audit PDF & CSV Export",
    free: "With FastCC watermark",
    pro: "Unbranded PDF + Full CSV",
    business: "Unbranded PDF + Full CSV",
  },
  {
    feature: "Custom Company Logo & QR Colors",
    free: false,
    pro: true,
    business: true,
  },
  {
    feature: "Location / Site Folders & Overdue Schedule Tracking",
    free: "Basic",
    pro: "Full Tracking",
    business: "Multi-Site / Branch Scale",
  },
  {
    feature: "CSV Bulk QR Generator (50–100+ Assets)",
    free: `Up to ${FREE_QR_CAP} quota`,
    pro: "Unlimited",
    business: "Unlimited + Multi-Branch",
  },
  {
    feature: "Support",
    free: "Standard",
    pro: "Email Support",
    business: "Priority Support",
  },
];

const COMPETITOR_LINKS = [
  {
    slug: "sopx",
    title: "FastCC QR vs. SOPX",
    summary:
      "Skip $199/mo enterprise contracts. Get permanent shop-floor QRs, AI Video-to-SOP, and 5 Indian languages starting at ₹0.",
  },
  {
    slug: "clappia",
    title: "FastCC QR vs. Clappia",
    summary:
      "Zero ₹450–₹600/user/mo seat tax and no mandatory worker app installs. Works directly in any mobile browser.",
  },
  {
    slug: "uniqode",
    title: "FastCC QR vs. Uniqode",
    summary:
      "Purpose-built for frontline equipment checks, live GPS photo proof, and FSSAI/ISO audit PDFs—not marketing links.",
  },
] as const;

const BUYER_FAQS = [
  {
    question: "Do workers need to download an app or log in?",
    answer:
      "No. Frontline workers and contract staff simply scan the QR sticker with any phone camera or Google Lens. The SOP and inspection checklist open directly in the mobile browser with 48px+ tap targets and 1-tap switching across English, हिन्दी, తెలుగు, मराठी, and தமிழ்.",
  },
  {
    question: "Can workers upload old photos from gallery?",
    answer:
      "No. Inspection photo capture enforces live mobile camera capture (capture='environment') and automatically burns the live Date, Time, and GPS coordinates directly onto the photo before submission.",
  },
  {
    question: "Is this valid for FSSAI / ISO audits?",
    answer:
      "Yes. Every inspection logs timestamped checklist results, equipment status (OK / Maintenance / Faulty), live GPS-watermarked photo proof, and a worker digital signature. Managers export chronological Audit PDFs and CSV logs in 1 click (unbranded on Pro and Business).",
  },
  {
    question: "How fast can we roll out 50–100 machines across branches?",
    answer:
      "In under 10 minutes. Upload your machine list via the CSV Bulk QR Generator, organize equipment by site or branch folders, and download cut-ready A4 sticker sheets (8, 12, or 16 labels per page).",
  },
] as const;

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
        amount: orderBody.amount ?? PLAN_SPECS[plan].amountPaise,
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
          TRANSPARENT INR PRICING • NO PER-USER WORKER TAX
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Industrial QR SOP &amp; Audit Inspection Plans
        </h1>
        <p className="mt-2 text-sm text-ink-muted sm:text-base">
          Unlimited frontline workers on every plan with zero app install or
          login. Upgrade when your operations need unbranded A4 stickers, Audit
          PDFs, and multi-site scale.
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

      {/* Feature Comparison Matrix */}
      <section
        aria-labelledby="plan-comparison-heading"
        className="mt-14 border-t border-border pt-10"
      >
        <div className="mb-6">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-utility-blue">
            Feature Comparison Matrix
          </span>
          <h2
            id="plan-comparison-heading"
            className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl"
          >
            Compare Free, Pro &amp; Business Side by Side
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-canvas-muted/70 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-3.5">Capability</th>
                <th className="px-4 py-3.5">
                  Free ({formatInrPrice(PLAN_SPECS.free.priceInr)})
                </th>
                <th className="px-4 py-3.5 text-action-green">
                  Pro ({formatInrPrice(PLAN_SPECS.pro.priceInr)}/mo)
                </th>
                <th className="px-4 py-3.5">
                  Business ({formatInrPrice(PLAN_SPECS.business.priceInr)}/mo)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs sm:text-sm">
              {COMPARISON_MATRIX.map((row) => (
                <tr key={row.feature} className="hover:bg-canvas/60">
                  <td className="px-4 py-3 font-medium text-ink">
                    {row.feature}
                  </td>
                  {(["free", "pro", "business"] as const).map((tierKey) => {
                    const value = row[tierKey];
                    return (
                      <td
                        key={tierKey}
                        className={`px-4 py-3 ${
                          tierKey === "pro"
                            ? "bg-action-green/[0.03] font-medium text-ink"
                            : "text-ink-muted"
                        }`}
                      >
                        {typeof value === "boolean" ? (
                          value ? (
                            <span className="inline-flex items-center gap-1 font-medium text-action-green">
                              <Check className="h-4 w-4 shrink-0" />
                              Included
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-ink-muted/70">
                              <Minus className="h-4 w-4 shrink-0" />
                              <span className="sr-only">Not included</span>
                            </span>
                          )
                        ) : (
                          <span>{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Competitor Comparison Strip */}
      <section
        aria-labelledby="competitor-compare-heading"
        className="mt-14 border-t border-border pt-10"
      >
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-action-green">
              How FastCC QR Compares
            </span>
            <h2
              id="competitor-compare-heading"
              className="mt-1 text-xl font-semibold tracking-tight text-ink"
            >
              Built for Indian SMBs—Without Enterprise Seat Taxes
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-muted">
            Detailed breakdowns
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {COMPETITOR_LINKS.map((item) => (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 transition-colors hover:border-utility-blue"
            >
              <div>
                <h3 className="text-sm font-semibold text-ink group-hover:text-utility-blue">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                  {item.summary}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-utility-blue">
                Read comparison
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Indian B2B Buyer FAQ */}
      <section
        aria-labelledby="pricing-faq-heading"
        className="mt-12 rounded-xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-action-green" />
          <h2
            id="pricing-faq-heading"
            className="text-lg font-semibold tracking-tight text-ink sm:text-xl"
          >
            Frequently Asked Questions for Plant &amp; Operations Teams
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {BUYER_FAQS.map((faq) => (
            <div
              key={faq.question}
              className="rounded-lg border border-border bg-canvas p-4 sm:p-5"
            >
              <h3 className="text-sm font-semibold text-ink">{faq.question}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted sm:text-sm">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
