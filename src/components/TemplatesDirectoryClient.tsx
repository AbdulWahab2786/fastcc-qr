"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckSquare,
  ClipboardList,
  Clock,
  Filter,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import type {
  SeoTemplate,
  SeoTemplateFrequency,
} from "@/data/seo-templates/types";

interface TemplatesDirectoryClientProps {
  templates: readonly SeoTemplate[];
  industries: readonly string[];
}

const FREQUENCY_OPTIONS: readonly {
  value: "all" | SeoTemplateFrequency;
  label: string;
}[] = [
  { value: "all", label: "All Frequencies" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const FREQUENCY_LABELS: Record<SeoTemplateFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export function TemplatesDirectoryClient({
  templates,
  industries,
}: TemplatesDirectoryClientProps) {
  const searchParams = useSearchParams();
  const initialIndustry = searchParams.get("industry");
  const validInitialIndustry =
    initialIndustry &&
    industries.some(
      (ind) => ind.toLowerCase() === initialIndustry.trim().toLowerCase(),
    )
      ? industries.find(
          (ind) => ind.toLowerCase() === initialIndustry.trim().toLowerCase(),
        ) ?? "all"
      : "all";

  const [query, setQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] =
    useState<string>(validInitialIndustry);
  const [selectedFrequency, setSelectedFrequency] = useState<
    "all" | SeoTemplateFrequency
  >("all");

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return templates.filter((template) => {
      if (
        selectedIndustry !== "all" &&
        template.industry !== selectedIndustry
      ) {
        return false;
      }

      if (
        selectedFrequency !== "all" &&
        template.frequency !== selectedFrequency
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        template.title,
        template.industry,
        template.shortDescription,
        ...template.complianceStandards,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [templates, query, selectedIndustry, selectedFrequency]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedIndustry !== "all" ||
    selectedFrequency !== "all";

  function clearFilters() {
    setQuery("");
    setSelectedIndustry("all");
    setSelectedFrequency("all");
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Panel */}
      <section
        aria-label="Filter SOP templates"
        className="rounded-xl border border-border bg-surface p-4 sm:p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search SOPs, equipment, or compliance (e.g. OSHA, FSSAI, Crane, Autoclave)..."
              aria-label="Search SOP templates"
              className="h-11 w-full rounded-lg border border-border bg-canvas pr-9 pl-10 text-sm text-ink placeholder:text-ink-muted focus:border-utility-blue focus:bg-surface focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-ink-muted hover:bg-canvas-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
              <Clock className="h-3.5 w-3.5" />
              Frequency:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FREQUENCY_OPTIONS.map((option) => {
                const isActive = selectedFrequency === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedFrequency(option.value)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "border-ink bg-ink text-surface"
                        : "border-border bg-canvas text-ink-muted hover:bg-canvas-muted hover:text-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Industry Filter Pills */}
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
              <Filter className="h-3.5 w-3.5" />
              Industry Verticals ({industries.length})
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-utility-blue hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedIndustry("all")}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedIndustry === "all"
                  ? "border-action-green bg-action-green text-white"
                  : "border-border bg-surface text-ink-muted hover:bg-canvas-muted hover:text-ink"
              }`}
            >
              All Industries ({templates.length})
            </button>
            {industries.map((industry) => {
              const isActive = selectedIndustry === industry;
              const count = templates.filter(
                (t) => t.industry === industry,
              ).length;
              return (
                <button
                  key={industry}
                  type="button"
                  onClick={() => setSelectedIndustry(industry)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "border-action-green bg-action-green text-white"
                      : "border-border bg-surface text-ink-muted hover:bg-canvas-muted hover:text-ink"
                  }`}
                >
                  {industry} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <p>
          Showing{" "}
          <span className="font-mono font-semibold text-ink">
            {filteredTemplates.length}
          </span>{" "}
          of{" "}
          <span className="font-mono font-semibold text-ink">
            {templates.length}
          </span>{" "}
          inspection &amp; SOP templates
        </p>
      </div>

      {/* Template Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-10 text-center">
          <p className="text-sm font-semibold text-ink">
            No matching SOP templates found
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Try clearing your search query or switching industry and frequency
            filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 inline-flex items-center rounded-lg border border-border bg-canvas px-4 py-2 text-xs font-semibold text-ink hover:bg-canvas-muted"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Link
              key={template.slug}
              href={`/templates/${template.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 transition-colors hover:border-utility-blue"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded border border-border bg-canvas-muted px-2 py-0.5 text-[11px] font-medium text-ink">
                    {template.industry}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-medium text-utility-blue">
                    <Clock className="h-3 w-3" />
                    {FREQUENCY_LABELS[template.frequency]}
                  </span>
                </div>

                <h2 className="mt-3 text-base font-semibold tracking-tight text-ink group-hover:text-utility-blue">
                  {template.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                  {template.shortDescription}
                </p>

                {template.complianceStandards.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {template.complianceStandards.slice(0, 3).map((std) => (
                      <span
                        key={std}
                        className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-medium text-action-green"
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {std}
                      </span>
                    ))}
                    {template.complianceStandards.length > 3 && (
                      <span className="rounded border border-border bg-canvas px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                        +{template.complianceStandards.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                <div className="flex items-center gap-3 font-mono text-[11px] text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <ClipboardList className="h-3.5 w-3.5" />
                    {template.sopSteps.length} steps
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CheckSquare className="h-3.5 w-3.5" />
                    {template.checklistItems.length} checks
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-medium text-utility-blue group-hover:underline">
                  View SOP
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
