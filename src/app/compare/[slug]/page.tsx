import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { COMPARISON_LIST, COMPARISONS } from "@/data/comparisons";

interface ComparePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return COMPARISON_LIST.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison =
    COMPARISONS[slug as keyof typeof COMPARISONS] ?? undefined;

  if (!comparison) {
    return {
      title: "Comparison Not Found — FastCC QR",
    };
  }

  return {
    title: comparison.metaTitle,
    description: comparison.metaDescription,
    openGraph: {
      title: comparison.metaTitle,
      description: comparison.metaDescription,
      type: "article",
    },
  };
}

async function CompareContent({ params }: ComparePageProps) {
  const { slug } = await params;
  const comparison =
    COMPARISONS[slug as keyof typeof COMPARISONS] ?? undefined;

  if (!comparison) {
    notFound();
  }

  const otherComparisons = COMPARISON_LIST.filter(
    (item) => item.slug !== comparison.slug,
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-ink hover:underline">
          FastCC QR
        </Link>
        <span>/</span>
        <span>Compare</span>
        <span>/</span>
        <span className="font-semibold text-ink">
          vs. {comparison.competitorName}
        </span>
      </div>

      {/* Hero */}
      <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="inline-flex items-center gap-1.5 rounded border border-border bg-canvas-muted px-2.5 py-1 text-xs font-semibold text-action-green">
          <ShieldCheck className="h-3.5 w-3.5" />
          {comparison.pricingHighlight}
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {comparison.headline}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-muted">
          {comparison.subheadline}
        </p>

        <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {comparison.keyDifferentiators.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 rounded-lg border border-border bg-canvas p-3.5 text-xs leading-relaxed text-ink"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-action-green" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-action-green px-5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            <Sparkles className="h-4 w-4" />
            Create Free Operational QR
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/q/demo"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:bg-canvas-muted"
          >
            Try Live Worker Scan (/q/demo)
          </Link>
        </div>
      </section>

      {/* Side-by-side Feature & Pricing Table */}
      <section className="mt-8 overflow-hidden rounded-xl border border-border bg-surface">
        <div className="border-b border-border bg-canvas-muted px-5 py-3.5">
          <h2 className="text-sm font-semibold text-ink">
            Side-by-Side Feature &amp; Pricing Comparison
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-canvas">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Capability
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-action-green">
                  FastCC QR
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {comparison.competitorName}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparison.rows.map((row) => (
                <tr key={row.feature} className="align-top">
                  <td className="px-5 py-4 font-semibold text-ink">
                    {row.feature}
                  </td>
                  <td className="px-5 py-4 text-ink">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-action-green" />
                      <span>{row.fastcc}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-muted">
                    <div className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-alert-red/80" />
                      <span>{row.competitor}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Who Should Switch */}
      <section className="mt-8 rounded-xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink">
          {comparison.whoShouldSwitch.title}
        </h2>
        <ul className="mt-4 space-y-3">
          {comparison.whoShouldSwitch.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-lg border border-border bg-canvas p-4 text-sm leading-relaxed text-ink"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-action-green" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Direct CTA back to / */}
      <section className="mt-8 flex flex-col justify-between gap-4 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-ink">
            Generate your first shop-floor QR in 30 seconds
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Upload a short SOP video, snap a paper checklist, or paste a link —
            zero login required.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-action-green px-5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
        >
          Open Instant Generator
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Other comparisons */}
      <section className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
        <span>More comparisons:</span>
        <div className="flex flex-wrap gap-3">
          {otherComparisons.map((item) => (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className="rounded-lg border border-border bg-surface px-3 py-2 font-semibold text-ink transition-colors hover:bg-canvas-muted"
            >
              {item.headline}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function ComparePage({ params }: ComparePageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
        </main>
      }
    >
      <CompareContent params={params} />
    </Suspense>
  );
}
