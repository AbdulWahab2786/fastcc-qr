import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, QrCode } from "lucide-react";
import { TemplatesDirectoryClient } from "@/components/TemplatesDirectoryClient";
import { getAllSeoTemplates, SEO_INDUSTRIES } from "@/data/seo-templates";
import { getSiteBaseUrl } from "@/lib/site-url";

const baseUrl = getSiteBaseUrl();

export const metadata: Metadata = {
  title: "Industrial SOP & Inspection QR Templates | FastCC QR",
  description:
    "Browse 100+ free industrial SOPs and inspection checklists across manufacturing, construction, healthcare, logistics, hospitality, energy, and pharma. Convert any template into a scannable QR sticker.",
  alternates: {
    canonical: `${baseUrl}/templates`,
  },
  openGraph: {
    title: "Industrial SOP & Inspection QR Templates | FastCC QR",
    description:
      "Browse 100+ free industrial SOPs and inspection checklists across 10 verticals. Convert any template into a live QR code sticker.",
    url: `${baseUrl}/templates`,
    type: "website",
  },
};

export default function TemplatesPage() {
  const templates = getAllSeoTemplates();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded border border-border bg-canvas-muted px-2.5 py-1 font-mono text-[11px] font-medium text-ink-muted">
            <QrCode className="h-3.5 w-3.5 text-action-green" />
            SOP &amp; CHECKLIST LIBRARY
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Industrial SOP &amp; Inspection QR Templates
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Ready-to-deploy standard operating procedures and compliance
            checklists across {SEO_INDUSTRIES.length} industries. Preview any
            SOP and convert it into a printable QR sticker in one click.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-action-green px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Build Custom QR
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="h-64 animate-pulse rounded-xl border border-border bg-surface" />
        }
      >
        <TemplatesDirectoryClient
          templates={templates}
          industries={SEO_INDUSTRIES}
        />
      </Suspense>
    </main>
  );
}
