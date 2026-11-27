import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Camera,
  FileCheck2,
  FileSpreadsheet,
  Languages,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { SavingsComparison } from "@/components/SavingsComparison";
import { FREE_QR_LIMIT } from "@/lib/billing/constants";

interface FeatureItem {
  title: string;
  badge: string;
  description: string;
  icon: typeof Camera;
}

const KILLER_FEATURES: FeatureItem[] = [
  {
    title: "Anti-Fake Live Photo Proof",
    badge: "CAMERA + GPS",
    description:
      "Blocks gallery uploads and stamps date, time, and GPS onto every live inspection photo.",
    icon: Camera,
  },
  {
    title: "1-Click FSSAI / ISO Audit Reports",
    badge: "PDF & CSV",
    description:
      "Export chronological inspection PDFs and CSV logs with photo evidence and worker signatures.",
    icon: FileCheck2,
  },
  {
    title: "5-Language Shop-Floor View",
    badge: "1-TAP SWITCH",
    description:
      "Author SOPs once in English; workers switch to हिन्दी, తెలుగు, मराठी, or தமிழ் in one tap.",
    icon: Languages,
  },
  {
    title: "Live Status & Overdue Alerts",
    badge: "WHATSAPP ALERTS",
    description:
      "Real-time OK, Maintenance, and Faulty badges with schedules and 1-tap WhatsApp alerts.",
    icon: Activity,
  },
  {
    title: "A4 Bulk Sticker Print Sheet",
    badge: "8 / 12 / 16 PER PAGE",
    description:
      "Download print-ready A4 PDF sticker sheets with cut-lines, grouped by site or folder.",
    icon: Printer,
  },
  {
    title: "CSV Bulk Upload & Site Folders",
    badge: "50–100+ ASSETS",
    description:
      "Import 50–100 equipment checklists from Excel or CSV and organize by floor or branch.",
    icon: FileSpreadsheet,
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Pick Template or Upload CSV",
    description:
      "Start with a 1-click template, digitize a video or paper log with AI, or bulk-import via CSV.",
  },
  {
    step: "02",
    title: "Print A4 Stickers & Paste",
    description:
      "Download cut-ready A4 sticker sheets (8, 12, or 16 per page) and stick them on machines.",
  },
  {
    step: "03",
    title: "Scan (No App) & Export PDFs",
    description:
      "Workers scan, switch language, and snap GPS photo proof; managers export audit PDFs.",
  },
] as const;

export function LandingShowcase() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      {/* Mailcheap-Style Competitor Savings Comparison */}
      <SavingsComparison />

      {/* 6-Card Killer Feature Grid */}
      <section
        aria-labelledby="features-heading"
        className="border-t border-border py-16 sm:py-20"
      >
        <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-action-green">
              Built for Shop-Floor Accountability
            </span>
            <h2
              id="features-heading"
              className="mt-1.5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              Everything Operations Teams Need to Replace Paper Logs
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-muted">
            Zero app installs for workers. Audit-grade records for managers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {KILLER_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="flex flex-col justify-between rounded-xl border border-border bg-surface p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-canvas-muted text-ink">
                      <Icon className="h-5 w-5 text-action-green" />
                    </div>
                    <span className="rounded border border-border bg-canvas px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3-Step How It Works Strip */}
      <section
        aria-labelledby="how-it-works-heading"
        className="border-t border-border py-16 sm:py-20"
      >
        <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-utility-blue">
              How It Works
            </span>
            <h2
              id="how-it-works-heading"
              className="mt-1.5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              From Spreadsheet to Live Audit Trail in 3 Steps
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-muted">
            Zero IT setup • Works on any smartphone
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ink font-mono text-xs font-semibold text-surface">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold text-ink">
                  {item.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom B2B CTA Banner */}
      <section
        aria-labelledby="bottom-cta-heading"
        className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-surface p-6 sm:p-10 lg:flex-row lg:items-center"
      >
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded border border-action-green/30 bg-action-green/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-action-green">
            <ShieldCheck className="h-3.5 w-3.5" />
            Ready for FSSAI, ISO &amp; Internal QA
          </div>
          <h2
            id="bottom-cta-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-ink"
          >
            Put Every Machine, Kitchen &amp; Warehouse Under Live QR Control
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Start free with up to {FREE_QR_LIMIT} permanent QR codes, GPS photo
            proof, digital signatures, and 5-language shop-floor views.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-action-green px-5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Start Free — No Card Required
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-canvas px-5 text-sm font-semibold text-ink transition-colors hover:bg-canvas-muted"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
