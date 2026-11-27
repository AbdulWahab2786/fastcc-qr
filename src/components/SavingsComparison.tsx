"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

type CompetitorKey = "safetyculture" | "uniqode" | "clappia";

interface SavingsStat {
  id: CompetitorKey;
  percent: string;
  competitor: string;
  sublabel: string;
}

const SAVINGS_STATS: SavingsStat[] = [
  {
    id: "safetyculture",
    percent: "85% Cheaper",
    competitor: "SafetyCulture / iAuditor",
    sublabel: "Flat ₹999/mo vs. $24/seat/mo",
  },
  {
    id: "uniqode",
    percent: "80% Cheaper",
    competitor: "Uniqode",
    sublabel: "Full SOPs & audits vs. $15–$49/mo",
  },
  {
    id: "clappia",
    percent: "75% Cheaper",
    competitor: "Clappia",
    sublabel: "Zero per-user fees vs. $6–$10/user/mo",
  },
];

interface ComparisonRow {
  feature: string;
  fastcc: string;
  clappia: string;
  safetyculture: string;
  uniqode: string;
  fastccIncluded?: boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Starting Monthly Price",
    fastcc: "₹999/mo",
    clappia: "$6–$10/user/mo",
    safetyculture: "$24/seat/mo",
    uniqode: "$15–$49/mo",
  },
  {
    feature: "Worker App / Login Required",
    fastcc: "Zero Login",
    clappia: "App / Login required",
    safetyculture: "App + Seat required",
    uniqode: "No SOP workflows",
  },
  {
    feature: "Live GPS Photo Watermark",
    fastcc: "Included",
    clappia: "Basic photo only",
    safetyculture: "Paid tier",
    uniqode: "Not included",
    fastccIncluded: true,
  },
  {
    feature: "5 Indian Languages",
    fastcc: "Included",
    clappia: "Manual setup",
    safetyculture: "English-first",
    uniqode: "English-first",
    fastccIncluded: true,
  },
  {
    feature: "A4 Bulk Sticker PDF",
    fastcc: "Included",
    clappia: "Not built-in",
    safetyculture: "Not built-in",
    uniqode: "Manual export",
    fastccIncluded: true,
  },
  {
    feature: "FSSAI / ISO Audit PDF",
    fastcc: "Included",
    clappia: "Custom setup",
    safetyculture: "Paid tier",
    uniqode: "Not included",
    fastccIncluded: true,
  },
];

export function SavingsComparison() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SAVINGS_STATS.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const activeCompetitor = SAVINGS_STATS[activeIndex]?.id;

  return (
    <section
      aria-labelledby="compare-heading"
      className="border-t border-border py-16 sm:py-20"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-action-green">
            Compare &amp; Save
          </span>
          <h2
            id="compare-heading"
            className="mt-1.5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            Enterprise QR Audits Without Per-Seat Pricing
          </h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">
            Built for Indian factories, kitchens, and warehouses—flat ₹999/mo
            team pricing with zero worker logins.
          </p>
        </div>

        <Link
          href="/pricing"
          className="inline-flex w-fit shrink-0 items-center gap-1.5 text-sm font-semibold text-utility-blue transition-opacity hover:opacity-80"
        >
          See full pricing
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Animated / Highlighted Savings Strip */}
      <div
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {SAVINGS_STATS.map((stat, idx) => {
          const isHighlighted = idx === activeIndex;
          return (
            <button
              key={stat.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`group rounded-xl border p-5 text-left transition-all duration-300 ${
                isHighlighted
                  ? "-translate-y-0.5 border-action-green bg-action-green/5 shadow-[0_2px_8px_rgba(22,163,74,0.08)]"
                  : "border-border bg-surface hover:border-action-green/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-2xl font-bold tracking-tight text-action-green sm:text-3xl">
                  {stat.percent}
                </span>
                <span
                  className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                    isHighlighted ? "bg-action-green" : "bg-border"
                  }`}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">
                than {stat.competitor}
              </p>
              <p className="mt-0.5 font-mono text-xs text-ink-muted">
                {stat.sublabel}
              </p>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-canvas-muted/60">
                <th
                  scope="col"
                  className="w-[26%] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-ink-muted"
                >
                  Capability
                </th>
                <th
                  scope="col"
                  className="w-[20%] border-x border-action-green/25 bg-action-green/10 px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">
                      FastCC QR
                    </span>
                    <span className="rounded bg-action-green px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-white">
                      Best Value
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className={`w-[18%] px-5 py-4 text-sm font-semibold transition-colors duration-300 ${
                    activeCompetitor === "clappia"
                      ? "bg-canvas text-ink"
                      : "text-ink-muted"
                  }`}
                >
                  Clappia
                </th>
                <th
                  scope="col"
                  className={`w-[18%] px-5 py-4 text-sm font-semibold transition-colors duration-300 ${
                    activeCompetitor === "safetyculture"
                      ? "bg-canvas text-ink"
                      : "text-ink-muted"
                  }`}
                >
                  SafetyCulture
                </th>
                <th
                  scope="col"
                  className={`w-[18%] px-5 py-4 text-sm font-semibold transition-colors duration-300 ${
                    activeCompetitor === "uniqode"
                      ? "bg-canvas text-ink"
                      : "text-ink-muted"
                  }`}
                >
                  Uniqode
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="transition-colors hover:bg-canvas/50">
                  <th
                    scope="row"
                    className="px-5 py-4 font-medium text-ink"
                  >
                    {row.feature}
                  </th>
                  <td className="border-x border-action-green/25 bg-action-green/5 px-5 py-4 font-semibold text-ink">
                    <span className="inline-flex items-center gap-1.5">
                      {row.fastccIncluded ? (
                        <Check className="h-4 w-4 shrink-0 text-action-green" />
                      ) : null}
                      <span>{row.fastcc}</span>
                    </span>
                  </td>
                  <td
                    className={`px-5 py-4 text-xs transition-colors duration-300 sm:text-sm ${
                      activeCompetitor === "clappia"
                        ? "bg-canvas/70 text-ink"
                        : "text-ink-muted"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Minus className="h-3.5 w-3.5 shrink-0 text-border" />
                      {row.clappia}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-4 text-xs transition-colors duration-300 sm:text-sm ${
                      activeCompetitor === "safetyculture"
                        ? "bg-canvas/70 text-ink"
                        : "text-ink-muted"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Minus className="h-3.5 w-3.5 shrink-0 text-border" />
                      {row.safetyculture}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-4 text-xs transition-colors duration-300 sm:text-sm ${
                      activeCompetitor === "uniqode"
                        ? "bg-canvas/70 text-ink"
                        : "text-ink-muted"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Minus className="h-3.5 w-3.5 shrink-0 text-border" />
                      {row.uniqode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
