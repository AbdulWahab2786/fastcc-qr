"use client";

import { useState, useSyncExternalStore, type ChangeEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Printer,
  Copy,
  Check,
  ImagePlus,
  ExternalLink,
  AlertCircle,
  LayoutTemplate,
  Lock,
} from "lucide-react";
import { QrCodePreview } from "@/components/QrCodePreview";
import {
  downloadStickerPng,
  downloadStickerSvg,
  type StudioLayoutPreset,
} from "@/lib/qr-export";
import {
  getDemoQrRecord,
  getLocalQrRecord,
  getQrScanUrl,
} from "@/lib/qr-utils";
import type { QrCodeRow } from "@/types/qr";

interface StudioClientProps {
  routeId: string;
  initialRecord: QrCodeRow | null;
  supabaseConfigured: boolean;
  isAuthenticated: boolean;
}

type LogoMode = "fastcc" | "custom" | "none";

const LAYOUT_PRESETS: {
  id: StudioLayoutPreset;
  label: string;
  dimensions: string;
}[] = [
  {
    id: "a4-poster",
    label: "A4 Wall Poster",
    dimensions: "210 × 297 mm",
  },
  {
    id: "equipment-plate",
    label: "Machine Equipment Plate",
    dimensions: "150 × 112 mm",
  },
  {
    id: "thermal-sticker",
    label: "Compact Thermal Sticker",
    dimensions: "58 × 86 mm",
  },
];

const subscribeNoop = () => () => {};

export function StudioClient({
  routeId,
  initialRecord,
  supabaseConfigured,
  isAuthenticated,
}: StudioClientProps) {
  const localRecord = useSyncExternalStore(
    subscribeNoop,
    () => (initialRecord ? null : getLocalQrRecord(routeId)),
    () => null,
  );

  const record = initialRecord ?? localRecord ?? getDemoQrRecord(routeId);
  const isLocalFallback = !initialRecord;
  const safeShortCode = record.short_code || routeId || "demo";

  const [preset, setPreset] = useState<StudioLayoutPreset>("equipment-plate");
  const [headerTitleOverride, setHeaderTitleOverride] = useState<string | null>(
    null,
  );
  const headerTitle = headerTitleOverride ?? (record.title || "Operations SOP");
  const [subtitle, setSubtitle] = useState<string>(
    "Scan for Hindi/English Steps",
  );
  const [logoMode, setLogoMode] = useState<LogoMode>("fastcc");
  const [customLogoDataUrl, setCustomLogoDataUrl] = useState<string | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<"png" | "svg" | null>(null);
  const [showLogoAuthPrompt, setShowLogoAuthPrompt] = useState(false);

  const activeLogoSrc =
    logoMode === "fastcc"
      ? "/logo.png"
      : logoMode === "custom"
        ? customLogoDataUrl
        : null;

  const scanUrl = getQrScanUrl(safeShortCode);

  function handleLogoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomLogoDataUrl(reader.result);
        setLogoMode("custom");
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(scanUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures in restricted contexts.
    }
  }

  async function handleDownloadPng() {
    setExporting("png");
    try {
      await downloadStickerPng(
        {
          qrUrl: scanUrl,
          shortCode: record.short_code,
          title: headerTitle,
          subtitle,
          preset,
          logoSrc: activeLogoSrc,
          showWatermark: record.show_watermark,
        },
        `fastcc-label-${record.short_code}-${preset}.png`,
      );
    } finally {
      setExporting(null);
    }
  }

  async function handleDownloadSvg() {
    setExporting("svg");
    try {
      await downloadStickerSvg(
        {
          qrUrl: scanUrl,
          shortCode: record.short_code,
          title: headerTitle,
          subtitle,
          preset,
          logoSrc: activeLogoSrc,
          showWatermark: record.show_watermark,
        },
        `fastcc-label-${record.short_code}-${preset}.svg`,
      );
    } finally {
      setExporting(null);
    }
  }

  const presetContainerClasses: Record<StudioLayoutPreset, string> = {
    "a4-poster":
      "w-full max-w-[460px] aspect-[210/297] p-8 justify-between border-slate-300",
    "equipment-plate":
      "w-full max-w-[500px] aspect-[4/3] p-6 justify-between border-2 border-ink",
    "thermal-sticker":
      "w-full max-w-[290px] aspect-[2/3] p-5 justify-between border-ink/80",
  };

  const qrSizeByPreset: Record<StudioLayoutPreset, number> = {
    "a4-poster": 240,
    "equipment-plate": 180,
    "thermal-sticker": 168,
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Top Studio Bar (hidden on print) */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-ink transition-colors hover:bg-canvas-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Generator
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-ink sm:text-lg">
                QR Label &amp; Logo Studio
              </h1>
              <span className="rounded border border-border bg-canvas-muted px-2 py-0.5 font-mono text-xs text-ink">
                {record.short_code}
              </span>
            </div>
            <p className="text-xs text-ink-muted">
              Customize printable shop-floor labels, logo overlay, and export
              formats.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-ink transition-colors hover:bg-canvas-muted"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-action-green" />
                Copied URL
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-ink-muted" />
                Copy /q/{record.short_code}
              </>
            )}
          </button>
          <Link
            href={`/q/${record.short_code}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-utility-blue transition-colors hover:bg-canvas-muted"
          >
            Worker View
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Guest Mode Banner */}
      {!isAuthenticated ? (
        <div className="no-print mb-5 flex flex-col gap-3 rounded-lg border border-utility-blue/30 bg-utility-blue/5 px-4 py-3 text-xs text-ink sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <Lock className="h-4 w-4 shrink-0 text-utility-blue" />
            <span>
              Guest Mode — Sign in to save this QR permanently, upload a custom
              logo, and track scans.
            </span>
          </div>
          <Link
            href="/login"
            className="inline-flex min-h-9 w-fit shrink-0 items-center justify-center gap-1.5 rounded-lg bg-ink px-3.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign In
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      {/* Subtle Fallback Banner */}
      {isLocalFallback ? (
        <div className="no-print mb-5 flex items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs text-ink-muted print:hidden">
          <AlertCircle className="h-4 w-4 shrink-0 text-utility-blue" />
          <span>
            {supabaseConfigured
              ? `Record "${routeId}" not found in Supabase — showing local/demo label preview.`
              : "Supabase env vars not configured — running Label Studio in local preview mode."}
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Controls Panel (hidden on print) */}
        <aside className="no-print space-y-5 lg:col-span-5 print:hidden">
          {/* Layout Presets */}
          <section className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4 text-utility-blue" />
              <h2 className="text-sm font-semibold text-ink">Layout Preset</h2>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {LAYOUT_PRESETS.map((item) => {
                const selected = preset === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreset(item.id)}
                    className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
                      selected
                        ? "border-utility-blue bg-utility-blue/5 text-ink"
                        : "border-border bg-surface text-ink-muted hover:bg-canvas-muted/60 hover:text-ink"
                    }`}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="font-mono text-xs text-ink-muted">
                      {item.dimensions}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Custom Text */}
          <section className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <h2 className="text-sm font-semibold text-ink">Label Text</h2>

            <div>
              <label
                htmlFor="studio-title"
                className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
              >
                Header Title
              </label>
              <input
                id="studio-title"
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitleOverride(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-utility-blue"
              />
            </div>

            <div>
              <label
                htmlFor="studio-subtitle"
                className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
              >
                Subtitle / Instruction Line
              </label>
              <input
                id="studio-subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g., Scan for Hindi/English Steps"
                className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-utility-blue"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-canvas-muted/60 px-3 py-2 text-xs">
              <span className="font-medium text-ink-muted">Visible ID</span>
              <span className="font-mono font-semibold text-ink">
                {record.short_code}
              </span>
            </div>
          </section>

          {/* Logo Overlay */}
          <section className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <h2 className="text-sm font-semibold text-ink">
              Center Logo Overlay (ECC Level H)
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLogoMode("fastcc")}
                className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                  logoMode === "fastcc"
                    ? "border-utility-blue bg-utility-blue/5 text-ink"
                    : "border-border text-ink-muted hover:text-ink"
                }`}
              >
                FastCC Logo
              </button>
              <button
                type="button"
                onClick={() => setLogoMode("none")}
                className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                  logoMode === "none"
                    ? "border-utility-blue bg-utility-blue/5 text-ink"
                    : "border-border text-ink-muted hover:text-ink"
                }`}
              >
                No Logo
              </button>
              {isAuthenticated ? (
                <label
                  className={`flex cursor-pointer items-center justify-center gap-1 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                    logoMode === "custom"
                      ? "border-utility-blue bg-utility-blue/5 text-ink"
                      : "border-border text-ink-muted hover:text-ink"
                  }`}
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="sr-only"
                  />
                </label>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLogoAuthPrompt(true)}
                  className="flex items-center justify-center gap-1 rounded-lg border border-border bg-canvas-muted/60 px-2.5 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-utility-blue/50 hover:text-ink"
                >
                  <Lock className="h-3.5 w-3.5 text-utility-blue" />
                  Upload
                </button>
              )}
            </div>
            {!isAuthenticated && showLogoAuthPrompt ? (
              <div className="flex items-center justify-between gap-2 rounded-lg border border-utility-blue/30 bg-utility-blue/5 px-3 py-2 text-xs text-ink">
                <span>Sign in to upload a custom logo.</span>
                <Link
                  href="/login"
                  className="shrink-0 font-semibold text-utility-blue hover:underline"
                >
                  Sign In
                </Link>
              </div>
            ) : null}
          </section>

          {/* Export Controls */}
          <section className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <h2 className="text-sm font-semibold text-ink">Export &amp; Print</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={exporting !== null}
                onClick={handleDownloadPng}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted disabled:opacity-60"
              >
                <Download className="h-4 w-4 text-utility-blue" />
                {exporting === "png" ? "Rendering..." : "Download PNG"}
              </button>
              <button
                type="button"
                disabled={exporting !== null}
                onClick={handleDownloadSvg}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted disabled:opacity-60"
              >
                <Download className="h-4 w-4 text-utility-blue" />
                {exporting === "svg" ? "Rendering..." : "Download SVG"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-action-green px-4 text-sm font-semibold text-white transition-opacity hover:opacity-95"
            >
              <Printer className="h-4 w-4" />
              Print / Save as PDF
            </button>
          </section>
        </aside>

        {/* Right Live Printable Sticker Preview */}
        <section
          aria-label="Printable Sticker Preview"
          className="flex items-start justify-center rounded-xl border border-border bg-canvas-muted/60 p-4 sm:p-8 lg:col-span-7 print:col-span-12 print:border-0 print:bg-white print:p-0"
        >
          <div
            id="printable-sticker"
            data-preset={preset}
            className={`relative flex flex-col items-center rounded-xl border bg-white text-center ${presetContainerClasses[preset]}`}
          >
            {/* Equipment Plate / Poster Top Bar */}
            {preset !== "thermal-sticker" ? (
              <div className="w-full border-b border-border pb-3">
                <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-ink" />
                <h2
                  className={`font-bold tracking-tight text-ink ${
                    preset === "a4-poster" ? "text-2xl" : "text-xl"
                  }`}
                >
                  {headerTitle || "Operations SOP"}
                </h2>
                <p
                  className={`mt-1 font-medium text-ink-muted ${
                    preset === "a4-poster" ? "text-sm" : "text-xs"
                  }`}
                >
                  {subtitle || "Scan for step-by-step instructions"}
                </p>
              </div>
            ) : (
              <div className="w-full pb-2">
                <h2 className="text-base font-bold leading-tight text-ink">
                  {headerTitle || "Operations SOP"}
                </h2>
                <p className="mt-0.5 text-[11px] font-medium text-ink-muted">
                  {subtitle || "Scan for instructions"}
                </p>
              </div>
            )}

            {/* High-ECC QR Code with Optional Center Logo */}
            <div className="my-2 flex flex-col items-center">
              <QrCodePreview
                value={scanUrl}
                size={qrSizeByPreset[preset]}
                logoSrc={activeLogoSrc}
              />
              <div className="mt-3 inline-flex items-center gap-1.5 rounded border border-border bg-canvas-muted px-2.5 py-1 font-mono text-xs font-semibold text-ink">
                ID: {record.short_code}
              </div>
            </div>

            {/* Watermark Footer */}
            <div className="w-full pt-2">
              {record.show_watermark ? (
                <p className="text-[11px] font-medium text-ink-muted">
                  Powered by FastCC QR
                </p>
              ) : (
                <span className="sr-only">Watermark disabled</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
