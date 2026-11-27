import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  HelpCircle,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import {
  getAllSeoTemplates,
  getSeoTemplateBySlug,
  getTemplatesByIndustry,
} from "@/data/seo-templates";
import type { SeoTemplateFrequency } from "@/data/seo-templates/types";
import { getSiteBaseUrl } from "@/lib/site-url";

const baseUrl = getSiteBaseUrl();

const FREQUENCY_LABELS: Record<SeoTemplateFrequency, string> = {
  daily: "Daily Inspection",
  weekly: "Weekly Inspection",
  monthly: "Monthly Inspection",
};

interface TemplateDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSeoTemplates().map((template) => ({
    slug: template.slug,
  }));
}

export async function generateMetadata({
  params,
}: TemplateDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getSeoTemplateBySlug(slug);

  if (!template) {
    return {
      title: "Template Not Found | FastCC QR",
    };
  }

  const canonicalUrl = `${baseUrl}/templates/${template.slug}`;

  return {
    title: template.seoTitle,
    description: template.seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: template.seoTitle,
      description: template.seoDescription,
      url: canonicalUrl,
      type: "article",
    },
  };
}

export default async function TemplateDetailPage({
  params,
}: TemplateDetailPageProps) {
  const { slug } = await params;
  const template = getSeoTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  const relatedTemplates = getTemplatesByIndustry(template.industry)
    .filter((item) => item.slug !== template.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: template.title,
        description: template.shortDescription,
        step: template.sopSteps.map((step) => ({
          "@type": "HowToStep",
          position: step.stepOrder,
          name: step.title,
          text: step.instruction,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: template.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  const workbenchHref = `/?seoTemplate=${encodeURIComponent(template.slug)}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:px-6 sm:py-10 lg:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted"
      >
        <Link href="/" className="hover:text-ink hover:underline">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/templates" className="hover:text-ink hover:underline">
          Templates
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/templates?industry=${encodeURIComponent(template.industry)}`}
          className="font-medium text-ink hover:underline"
        >
          {template.industry}
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header Card */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-border bg-canvas-muted px-2.5 py-1 text-xs font-medium text-ink">
                {template.industry}
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 font-mono text-xs font-medium text-utility-blue">
                <Clock className="h-3.5 w-3.5" />
                {FREQUENCY_LABELS[template.frequency]}
              </span>
              {template.complianceStandards.map((standard) => (
                <span
                  key={standard}
                  className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs font-medium text-action-green"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {standard}
                </span>
              ))}
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {template.title}
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-muted sm:text-base">
              {template.shortDescription}
            </p>
          </section>

          {/* SOP Steps */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-utility-blue" />
                <h2 className="text-lg font-semibold text-ink">
                  Standard Operating Procedure ({template.sopSteps.length} Steps)
                </h2>
              </div>
              <span className="font-mono text-xs text-ink-muted">
                WORKER VIEW PREVIEW
              </span>
            </div>

            <ol className="space-y-3">
              {template.sopSteps.map((step) => (
                <li
                  key={step.stepOrder}
                  className={`rounded-lg border p-4 ${
                    step.isCritical
                      ? "border-red-200 bg-red-50/40"
                      : "border-border bg-canvas"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                        step.isCritical
                          ? "bg-alert-red text-white"
                          : "border border-border bg-surface text-ink"
                      }`}
                    >
                      {String(step.stepOrder).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-ink">
                          {step.title}
                        </h3>
                        {step.isCritical && (
                          <span className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-alert-red">
                            <AlertTriangle className="h-3 w-3" />
                            Critical
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-ink-muted sm:text-sm">
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Inspection Checklist */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-action-green" />
                <h2 className="text-lg font-semibold text-ink">
                  Inspection Checklist ({template.checklistItems.length} Items)
                </h2>
              </div>
              <span className="font-mono text-xs text-ink-muted">
                PASS / FAIL LOGGING
              </span>
            </div>

            <ul className="divide-y divide-border rounded-lg border border-border bg-canvas">
              {template.checklistItems.map((item, idx) => (
                <li
                  key={`${item.label}-${idx}`}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 shrink-0 rounded border border-border bg-surface" />
                    <span className="text-sm text-ink">{item.label}</span>
                  </div>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-medium uppercase ${
                      item.required
                        ? "border border-emerald-200 bg-emerald-50 text-action-green"
                        : "border border-border bg-surface text-ink-muted"
                    }`}
                  >
                    {item.required ? "Required" : "Optional"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQs */}
          {template.faqs.length > 0 && (
            <section className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <HelpCircle className="h-5 w-5 text-utility-blue" />
                <h2 className="text-lg font-semibold text-ink">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-3">
                {template.faqs.map((faq, index) => (
                  <details
                    key={faq.question}
                    open={index === 0}
                    className="group rounded-lg border border-border bg-canvas p-4"
                  >
                    <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted sm:text-sm">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky Sidebar CTA (Desktop) */}
        <aside className="lg:sticky lg:top-20">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="inline-flex items-center gap-1.5 rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-action-green">
              <QrCode className="h-3.5 w-3.5" />
              READY FOR SHOP FLOOR
            </div>
            <h2 className="mt-3 text-base font-semibold text-ink">
              Deploy this SOP on your equipment
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
              Pre-load all {template.sopSteps.length} SOP steps and{" "}
              {template.checklistItems.length} checklist items into the QR
              Label Studio. Print A4 posters or thermal stickers in seconds.
            </p>

            <Link
              href={workbenchHref}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-action-green px-4 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Convert to Live QR Sticker (Free)
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>

            <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-ink-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-action-green" />
                Permanent QR code &amp; mobile worker view
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-action-green" />
                Photo proof &amp; WhatsApp defect alerts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-action-green" />
                No app download required for workers
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Related Templates */}
      {relatedTemplates.length > 0 && (
        <section className="mt-10 border-t border-border pt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">
              More {template.industry} Templates
            </h2>
            <Link
              href={`/templates?industry=${encodeURIComponent(template.industry)}`}
              className="text-xs font-medium text-utility-blue hover:underline"
            >
              View all in {template.industry}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTemplates.map((rel) => (
              <Link
                key={rel.slug}
                href={`/templates/${rel.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-utility-blue"
              >
                <div>
                  <span className="font-mono text-[11px] font-medium text-utility-blue">
                    {FREQUENCY_LABELS[rel.frequency]}
                  </span>
                  <h3 className="mt-1.5 text-sm font-semibold text-ink group-hover:text-utility-blue">
                    {rel.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                    {rel.shortDescription}
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-utility-blue group-hover:underline">
                  View Template
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 p-3 backdrop-blur lg:hidden">
        <Link
          href={workbenchHref}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-action-green px-4 py-2.5 text-sm font-semibold text-white"
        >
          Convert to Live QR Sticker (Free)
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </main>
  );
}
