"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, Printer, Scissors, X } from "lucide-react";
import {
  generateA4StickerSheetPdf,
  type GridDensity,
} from "@/lib/a4-print-sheet";
import type { PlanTier } from "@/types/database";
import type { QrCodeRow } from "@/types/qr";

interface BulkPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQrs: QrCodeRow[];
  plan: PlanTier;
}

interface DensityOption {
  value: GridDensity;
  title: string;
  subtitle: string;
}

const DENSITY_OPTIONS: DensityOption[] = [
  {
    value: 8,
    title: "8 per page",
    subtitle: "2×4 — Large",
  },
  {
    value: 12,
    title: "12 per page",
    subtitle: "3×4 — Medium",
  },
  {
    value: 16,
    title: "16 per page",
    subtitle: "4×4 — Compact",
  },
];

export function BulkPrintModal({
  isOpen,
  onClose,
  selectedQrs,
  plan,
}: BulkPrintModalProps) {
  const [density, setDensity] = useState<GridDensity>(12);
  const [showCutLines, setShowCutLines] = useState(true);
  const [footerLabel, setFooterLabel] = useState("SCAN FOR SOP & LOGS");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isGenerating) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isGenerating, onClose]);

  if (!isOpen) return null;

  const qrCount = selectedQrs.length;
  const pageCount = Math.max(1, Math.ceil(qrCount / density));

  async function handleDownloadPdf() {
    if (qrCount === 0 || isGenerating) return;
    setErrorMessage(null);
    setIsGenerating(true);

    try {
      await generateA4StickerSheetPdf({
        qrs: selectedQrs,
        density,
        showCutLines,
        footerLabel,
        plan,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not generate A4 PDF. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-print-modal-title"
      onClick={() => {
        if (!isGenerating) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-canvas-muted text-ink">
              <Printer className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="bulk-print-modal-title"
                className="text-base font-semibold text-ink"
              >
                Print A4 Sticker Sheet
              </h2>
              <p className="text-xs text-ink-muted">
                High-DPI A4 Portrait (210mm × 297mm) print-ready PDF
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            aria-label="Close modal"
            className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-5 py-5">
          {/* Grid Density */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Grid Density
            </span>
            <div className="mt-2 grid grid-cols-3 gap-2.5">
              {DENSITY_OPTIONS.map((option) => {
                const active = density === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDensity(option.value)}
                    aria-pressed={active}
                    className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "border-action-green bg-action-green/10 text-ink"
                        : "border-border bg-surface text-ink-muted hover:bg-canvas-muted hover:text-ink"
                    }`}
                  >
                    <div className="text-xs font-semibold text-ink">
                      {option.title}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-ink-muted">
                      {option.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cut Lines Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-canvas px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <Scissors className="h-4 w-4 text-ink-muted" />
              <div>
                <div className="text-xs font-semibold text-ink">
                  Dashed Cut Lines (- - -)
                </div>
                <div className="text-[11px] text-ink-muted">
                  Light gray guides around each sticker cell
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showCutLines}
              aria-label="Toggle dashed cut lines"
              onClick={() => setShowCutLines((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors ${
                showCutLines
                  ? "border-action-green bg-action-green"
                  : "border-border bg-canvas-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  showCutLines ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Footer Label */}
          <div>
            <label
              htmlFor="bulk-print-footer-label"
              className="block text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              Footer Label
            </label>
            <input
              id="bulk-print-footer-label"
              type="text"
              value={footerLabel}
              onChange={(e) => setFooterLabel(e.target.value)}
              maxLength={40}
              placeholder="SCAN FOR SOP & LOGS"
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-ink placeholder:text-ink-muted/60 focus:border-utility-blue focus:outline-none"
            />
          </div>

          {/* Live Preview Summary */}
          <div className="rounded-lg border border-border bg-canvas-muted/60 px-3.5 py-2.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-ink">
                {qrCount} {qrCount === 1 ? "QR" : "QRs"} selected &rarr;{" "}
                {pageCount} A4 {pageCount === 1 ? "page" : "pages"} ({density}{" "}
                per page)
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                {plan === "free" ? "Free watermark" : "Unbranded"}
              </span>
            </div>
          </div>

          {errorMessage ? (
            <div
              role="alert"
              className="rounded-lg border border-alert-red/30 bg-alert-red/5 px-3 py-2 text-xs text-alert-red"
            >
              {errorMessage}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-border px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:bg-canvas-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={qrCount === 0 || isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-action-green px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Download A4 PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
