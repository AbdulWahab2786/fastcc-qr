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
      "Enforces live mobile camera capture only—blocking old gallery uploads—and burns Date, Time, and GPS coordinates directly onto every inspection photo.",
    icon: Camera,
  },
  {
    title: "1-Click FSSAI / ISO Audit Reports",
    badge: "PDF & CSV",
    description:
      "Export chronological inspection PDFs and CSV logs complete with compliance KPIs, photo evidence links, equipment status, and worker digital signatures.",
    icon: FileCheck2,
  },
  {
    title: "5-Language Shop-Floor View",
    badge: "1-TAP SWITCH",
    description:
      "Managers author SOPs once in English; frontline operators switch to हिन्दी, తెలుగు, मराठी, or தமிழ் in a single tap—zero extra setup.",
    icon: Languages,
  },
  {
    title: "Live Status & Overdue Alerts",
    badge: "WHATSAPP ALERTS",
    description:
      "Real-time OK, Maintenance, and Faulty machine badges with Daily, Weekly, or Monthly schedules, overdue flags, and 1-tap WhatsApp Faulty Alerts.",
    icon: Activity,
  },
  {
    title: "A4 Bulk Sticker Print Sheet",
    badge: "8 / 12 / 16 PER PAGE",
    description:
      "Select QR labels by site or folder and download print-ready A4 PDFs with 8, 12, or 16 stickers per sheet, cut-lines, and custom footer tags.",
    icon: Printer,
  },
  {
    title: "CSV Bulk Upload & Site Folders",
    badge: "50–100+ ASSETS",
    description:
      "Import 50–100 equipment checklists in seconds from Excel or CSV, auto-wire SOP steps and WhatsApp numbers, and group assets by floor, kitchen, or branch.",
    icon: FileSpreadsheet,
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Pick Template or Upload CSV",
    description:
      "Start with a 1-click FSSAI, DG set, or forklift template above, digitize a 60s video or paper register with AI, or bulk-upload 50–100 assets via CSV.",
  },
  {
    step: "02",
    title: "Print A4 Stickers & Paste on Machines",
    description:
      "Download cut-ready A4 sticker sheets (8, 12, or 16 stickers per page) or single equipment plates and paste them directly onto machines and stations.",
  },
  {
    step: "03",
    title: "Workers Scan (No App/Login) & Managers Export Audit PDFs",
    description:
      "Staff scan with any phone camera, switch to their language, snap live GPS-stamped photo proof & sign; managers monitor status and export audit PDFs.",
  },
] as const;

export function LandingShowcase() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 pb-14 sm:px-6">
      {/* 6-Card Killer Feature Grid */}
      <section aria-labelledby="features-heading" className="border-t border-border pt-10">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-action-green">
              Built for Shop-Floor Accountability
            </span>
            <h2
              id="features-heading"
              className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl"
            >
              Everything Indian Operations Teams Need to Replace Paper Logs
            </h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-ink-muted sm:text-sm">
            Engineered for factories, cloud kitchens, and warehouses—zero app
            installs for workers, audit-grade records for managers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KILLER_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5"
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
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-muted sm:text-sm">
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
        className="rounded-xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-utility-blue">
              How It Works
            </span>
            <h2
              id="how-it-works-heading"
              className="mt-1 text-xl font-semibold tracking-tight text-ink"
            >
              From Spreadsheet or Template to Live Audit Trail in 3 Steps
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-muted">
            Zero IT setup • Works on any smartphone
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-lg border border-border bg-canvas p-4 sm:p-5"
            >
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ink font-mono text-xs font-semibold text-surface">
                  {item.step}
                </span>
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-ink-muted sm:text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom B2B CTA Banner */}
      <section
        aria-labelledby="bottom-cta-heading"
        className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-surface p-6 sm:p-8 lg:flex-row lg:items-center"
      >
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded border border-action-green/30 bg-action-green/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-action-green">
            <ShieldCheck className="h-3.5 w-3.5" />
            Ready for FSSAI, ISO &amp; Internal QA
          </div>
          <h2
            id="bottom-cta-heading"
            className="mt-3 text-xl font-semibold tracking-tight text-ink sm:text-2xl"
          >
            Put Every Machine, Kitchen Station &amp; Warehouse Asset Under Live QR Control
          </h2>
          <p className="mt-1.5 text-sm text-ink-muted">
            Start free with up to {FREE_QR_LIMIT} permanent QR codes, GPS photo
            proof, worker digital signatures, and 5-language shop-floor views.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-action-green px-5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Start Free — No Credit Card Required
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
