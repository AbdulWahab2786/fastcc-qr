"use client";

import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Folder,
  Loader2,
  Lock,
  Printer,
  Upload,
  X,
} from "lucide-react";
import { generateA4StickerSheetPdf } from "@/lib/a4-print-sheet";
import {
  canUseA4BulkPrint,
  getQrLimit,
  isPaidPlan,
  PLAN_SPECS,
} from "@/lib/billing/constants";
import {
  downloadSampleBulkCsv,
  parseBulkQrCsv,
  type BulkCsvParseResult,
  type ParsedBulkCsvRow,
} from "@/lib/csv-bulk-import";
import { generateShortCode, getQrFolder } from "@/lib/qr-utils";
import { createClient } from "@/lib/supabase/client";
import type { Json, PlanTier } from "@/types/database";
import type { QrCodeInsert, QrCodeRow, SopStepInsert } from "@/types/qr";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingQrCount: number;
  plan: PlanTier;
  onImported: (importedQrs: QrCodeRow[]) => void;
}

const BATCH_CHUNK_SIZE = 20;

export function BulkImportModal({
  isOpen,
  onClose,
  existingQrCount,
  plan,
  onImported,
}: BulkImportModalProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parseResult, setParseResult] = useState<BulkCsvParseResult | null>(
    null,
  );
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importedQrs, setImportedQrs] = useState<QrCodeRow[] | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);
  const [showPrintUpgradePrompt, setShowPrintUpgradePrompt] = useState(false);

  const allowA4Print = canUseA4BulkPrint(plan);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isImporting && !isPrinting) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isImporting, isPrinting, onClose]);

  if (!isOpen) return null;

  const qrLimit = getQrLimit(plan);
  const planName = PLAN_SPECS[plan].name;
  const remainingSlots =
    qrLimit === null ? null : Math.max(0, qrLimit - existingQrCount);
  const validRows = parseResult?.validRows ?? [];
  const exceedsQuota =
    remainingSlots !== null &&
    validRows.length > 0 &&
    validRows.length > remainingSlots;
  const atZeroQuota =
    remainingSlots !== null && remainingSlots === 0 && parseResult !== null;

  function resetState() {
    setFileName(null);
    setParseResult(null);
    setImportProgress(null);
    setImportError(null);
    setImportedQrs(null);
    setPrintError(null);
    setShowPrintUpgradePrompt(false);
  }

  function handleClose() {
    if (isImporting || isPrinting) return;
    resetState();
    onClose();
  }

  async function processCsvFile(file: File) {
    setImportError(null);
    setImportedQrs(null);
    setPrintError(null);
    setFileName(file.name);

    try {
      const text = await file.text();
      setParseResult(parseBulkQrCsv(text));
    } catch {
      setParseResult({
        headerError: "Could not read the selected CSV file.",
        rows: [],
        validRows: [],
        invalidCount: 0,
      });
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    void processCsvFile(file);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    void processCsvFile(file);
  }

  async function handleGenerateQrs() {
    if (validRows.length === 0 || exceedsQuota || isImporting) return;

    setIsImporting(true);
    setImportError(null);
    setImportProgress({ done: 0, total: validRows.length });

    const createdQrs: QrCodeRow[] = [];

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setImportError("Session expired. Please sign in again to import QRs.");
        return;
      }

      const showWatermark = !isPaidPlan(plan);
      const usedCodes = new Set<string>();

      for (
        let start = 0;
        start < validRows.length;
        start += BATCH_CHUNK_SIZE
      ) {
        const chunk = validRows.slice(start, start + BATCH_CHUNK_SIZE);
        const rowByShortCode = new Map<string, ParsedBulkCsvRow>();
        const qrPayloads: QrCodeInsert[] = [];

        for (const row of chunk) {
          let shortCode = generateShortCode(8);
          while (usedCodes.has(shortCode)) {
            shortCode = generateShortCode(8);
          }
          usedCodes.add(shortCode);
          rowByShortCode.set(shortCode, row);

          const configObj: Record<string, Json> = {};
          if (row.folder) {
            configObj.folder = row.folder;
          }
          if (row.managerWhatsapp) {
            configObj.manager_whatsapp = row.managerWhatsapp;
          }

          qrPayloads.push({
            short_code: shortCode,
            user_id: user.id,
            title: row.title,
            description:
              row.sopSteps.length > 0
                ? `${row.sopSteps.length} SOP ${row.sopSteps.length === 1 ? "step" : "steps"}`
                : null,
            category: "sop",
            type: "sop",
            config_json: configObj as Json,
            show_watermark: showWatermark,
          });
        }

        const { data: insertedRows, error: insertError } = await supabase
          .from("qr_codes")
          .insert(qrPayloads)
          .select();

        if (insertError || !insertedRows) {
          if (createdQrs.length > 0) {
            onImported(createdQrs);
          }
          const msg = insertError?.message ?? "Batch insert failed.";
          setImportError(
            msg.toLowerCase().includes("row-level security")
              ? `Plan limit reached while importing. Created ${createdQrs.length} of ${validRows.length} QRs.`
              : `Import stopped after ${createdQrs.length} QRs: ${msg}`,
          );
          return;
        }

        const stepPayloads: SopStepInsert[] = [];
        for (const insertedQr of insertedRows) {
          const sourceRow = rowByShortCode.get(insertedQr.short_code);
          if (!sourceRow || sourceRow.sopSteps.length === 0) continue;
          for (const step of sourceRow.sopSteps) {
            stepPayloads.push({
              qr_code_id: insertedQr.id,
              step_order: step.stepOrder,
              title: step.title,
              instruction: step.instruction,
              is_critical: step.isCritical,
            });
          }
        }

        if (stepPayloads.length > 0) {
          const { error: stepsError } = await supabase
            .from("sop_steps")
            .insert(stepPayloads);
          if (stepsError) {
            if (createdQrs.length > 0 || insertedRows.length > 0) {
              onImported([...createdQrs, ...insertedRows]);
            }
            setImportError(
              `QR codes created, but saving SOP steps failed: ${stepsError.message}`,
            );
            return;
          }
        }

        createdQrs.push(...insertedRows);
        setImportProgress({ done: createdQrs.length, total: validRows.length });
      }

      onImported(createdQrs);
      setImportedQrs(createdQrs);
    } catch {
      if (createdQrs.length > 0) {
        onImported(createdQrs);
      }
      setImportError("Unexpected network error during CSV import.");
    } finally {
      setIsImporting(false);
    }
  }

  async function handlePrintImportedPdf() {
    if (!allowA4Print) {
      setShowPrintUpgradePrompt(true);
      return;
    }
    if (!importedQrs || importedQrs.length === 0 || isPrinting) return;
    setPrintError(null);
    setIsPrinting(true);

    try {
      await generateA4StickerSheetPdf({
        qrs: importedQrs,
        density: 12,
        showCutLines: true,
        footerLabel: "SCAN FOR SOP & LOGS",
        plan,
      });
    } catch (error) {
      setPrintError(
        error instanceof Error
          ? error.message
          : "Could not generate A4 PDF. Please try again.",
      );
    } finally {
      setIsPrinting(false);
    }
  }

  const importedFolderCount = importedQrs
    ? new Set(importedQrs.map((qr) => getQrFolder(qr))).size
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-import-modal-title"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl border border-border bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-canvas-muted text-ink">
              <FileSpreadsheet className="h-4 w-4 text-action-green" />
            </div>
            <div>
              <h2
                id="bulk-import-modal-title"
                className="text-base font-semibold text-ink"
              >
                Bulk Import QR Codes from CSV
              </h2>
              <p className="text-xs text-ink-muted">
                Upload equipment lists with optional location folders, pipe{" "}
                <code className="font-mono">|</code> SOP steps, and WhatsApp
                alert numbers.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isImporting || isPrinting}
            aria-label="Close bulk import modal"
            className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {importedQrs ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-action-green/30 bg-action-green/5 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-action-green/15 text-action-green">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-base font-semibold text-ink">
                  Generated {importedQrs.length}{" "}
                  {importedQrs.length === 1 ? "QR Code" : "QR Codes"}
                </h3>
                <p className="mt-1 text-xs text-ink-muted">
                  Saved to your dashboard across {importedFolderCount}{" "}
                  {importedFolderCount === 1 ? "folder" : "folders"} and ready
                  to print as A4 stickers.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePrintImportedPdf}
                    disabled={isPrinting}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-action-green px-4 text-xs font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                  >
                    {isPrinting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Preparing A4 PDF...</span>
                      </>
                    ) : (
                      <>
                        {allowA4Print ? (
                          <Printer className="h-3.5 w-3.5" />
                        ) : (
                          <Lock className="h-3.5 w-3.5" />
                        )}
                        <span>Print Imported QRs (A4 PDF)</span>
                        {!allowA4Print ? (
                          <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-white">
                            Pro
                          </span>
                        ) : null}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetState}
                    disabled={isPrinting}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-surface px-3.5 text-xs font-medium text-ink transition-colors hover:bg-canvas-muted disabled:opacity-50"
                  >
                    Import Another CSV
                  </button>
                </div>
              </div>

              {showPrintUpgradePrompt && !allowA4Print ? (
                <div
                  role="alert"
                  className="flex flex-col gap-3 rounded-lg border border-utility-blue/30 bg-utility-blue/5 px-4 py-3 text-xs text-ink sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 shrink-0 text-utility-blue" />
                    <span>
                      A4 Bulk Sticker Sheet PDF is available on Pro (₹999/mo) and
                      Business plans.
                    </span>
                  </div>
                  <Link
                    href="/pricing"
                    className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg bg-action-green px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                  >
                    <span>Upgrade to Pro</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : null}

              {printError ? (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-lg border border-alert-red/30 bg-alert-red/5 px-3.5 py-2.5 text-xs text-alert-red"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{printError}</span>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              {/* Step 1: Sample Template + File Dropzone */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-canvas px-3.5 py-3">
                <div className="text-xs">
                  <p className="font-semibold text-ink">
                    CSV Columns: <code className="font-mono">title</code>{" "}
                    (required), <code className="font-mono">folder</code>,{" "}
                    <code className="font-mono">sop_steps</code>,{" "}
                    <code className="font-mono">manager_whatsapp</code>
                  </p>
                  <p className="mt-0.5 text-ink-muted">
                    Separate multiple SOP steps with a pipe{" "}
                    <code className="font-mono">|</code> character.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleBulkCsv}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted"
                >
                  <Download className="h-3.5 w-3.5 text-utility-blue" />
                  <span>Download Sample CSV</span>
                </button>
              </div>

              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                  isDragging
                    ? "border-utility-blue bg-utility-blue/5"
                    : "border-border bg-canvas hover:bg-canvas-muted/70"
                }`}
              >
                <Upload className="h-6 w-6 text-ink-muted" />
                <span className="mt-2 text-xs font-semibold text-ink sm:text-sm">
                  {fileName
                    ? `Selected: ${fileName} (drop or click to replace)`
                    : "Drag and drop your .csv file here, or click to browse"}
                </span>
                <span className="mt-1 font-mono text-[11px] text-ink-muted">
                  RFC-4180 CSV • UTF-8
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  disabled={isImporting}
                  className="sr-only"
                />
              </label>

              {/* Header / Parse Error */}
              {parseResult?.headerError ? (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-alert-red/30 bg-alert-red/5 px-3.5 py-2.5 text-xs text-alert-red"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{parseResult.headerError}</span>
                </div>
              ) : null}

              {/* Plan Quota Banner */}
              {exceedsQuota || atZeroQuota ? (
                <div
                  role="alert"
                  className="flex flex-col gap-3 rounded-lg border border-alert-red/30 bg-alert-red/5 px-4 py-3 text-xs text-ink sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-2.5">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-alert-red" />
                    <div>
                      <p className="font-semibold text-ink">
                        {planName} Plan Limit Exceeded ({existingQrCount}/
                        {qrLimit} used • {remainingSlots}{" "}
                        {remainingSlots === 1 ? "slot" : "slots"} remaining)
                      </p>
                      <p className="mt-0.5 text-ink-muted">
                        Your CSV has {validRows.length} valid{" "}
                        {validRows.length === 1 ? "row" : "rows"}, which
                        exceeds your remaining quota by{" "}
                        {Math.max(0, validRows.length - (remainingSlots ?? 0))}.
                        Trim the CSV or upgrade for unlimited QR codes.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    className="inline-flex min-h-9 w-fit shrink-0 items-center justify-center gap-1.5 rounded-lg bg-action-green px-3.5 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                  >
                    <span>Upgrade Plan</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : null}

              {/* Step 2: Live Preview Table */}
              {parseResult && !parseResult.headerError ? (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">
                        Preview ({parseResult.rows.length}{" "}
                        {parseResult.rows.length === 1 ? "row" : "rows"})
                      </span>
                      <span className="rounded-md border border-action-green/30 bg-action-green/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-action-green">
                        {validRows.length} valid
                      </span>
                      {parseResult.invalidCount > 0 ? (
                        <span className="rounded-md border border-alert-red/30 bg-alert-red/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-alert-red">
                          {parseResult.invalidCount} skipped (errors)
                        </span>
                      ) : null}
                    </div>
                    {remainingSlots !== null ? (
                      <span className="font-mono text-[11px] text-ink-muted">
                        Quota: {existingQrCount + validRows.length}/{qrLimit}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] text-ink-muted">
                        {planName} • Unlimited QRs
                      </span>
                    )}
                  </div>

                  <div className="max-h-64 overflow-auto rounded-xl border border-border bg-surface">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="sticky top-0 border-b border-border bg-canvas-muted text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                        <tr>
                          <th className="px-3 py-2">#</th>
                          <th className="px-3 py-2">Title</th>
                          <th className="px-3 py-2">Folder</th>
                          <th className="px-3 py-2">SOP Steps</th>
                          <th className="px-3 py-2">WhatsApp</th>
                          <th className="px-3 py-2">Validation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {parseResult.rows.map((row) => (
                          <tr
                            key={row.rowNumber}
                            className={
                              row.isValid ? "" : "bg-alert-red/[0.04]"
                            }
                          >
                            <td className="px-3 py-2 font-mono text-ink-muted">
                              {row.rowNumber}
                            </td>
                            <td className="max-w-[180px] truncate px-3 py-2 font-medium text-ink">
                              {row.title || (
                                <span className="italic text-alert-red">
                                  (missing)
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 rounded border border-border bg-canvas px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                                <Folder className="h-3 w-3" />
                                {row.folder || "Unassigned"}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap font-mono text-ink-muted">
                              {row.sopSteps.length > 0
                                ? `${row.sopSteps.length} ${
                                    row.sopSteps.length === 1 ? "step" : "steps"
                                  }`
                                : "0 steps"}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap font-mono text-ink-muted">
                              {row.managerWhatsapp || "—"}
                            </td>
                            <td className="px-3 py-2">
                              {row.isValid ? (
                                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-action-green">
                                  OK
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-alert-red">
                                  {row.errors.join("; ")}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {/* Progress / Import Error */}
              {isImporting && importProgress ? (
                <div className="space-y-1.5 rounded-lg border border-border bg-canvas px-3.5 py-3 text-xs">
                  <div className="flex items-center justify-between font-medium text-ink">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-action-green" />
                      Generating QR codes in batches...
                    </span>
                    <span className="font-mono">
                      {importProgress.done}/{importProgress.total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-muted">
                    <div
                      className="h-full bg-action-green transition-all"
                      style={{
                        width: `${Math.round(
                          (importProgress.done /
                            Math.max(1, importProgress.total)) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ) : null}

              {importError ? (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-alert-red/30 bg-alert-red/5 px-3.5 py-2.5 text-xs text-alert-red"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-border px-5 py-3.5">
          {importedQrs ? (
            <button
              type="button"
              onClick={handleClose}
              disabled={isPrinting}
              className="rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Done
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                disabled={isImporting}
                className="rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-medium text-ink transition-colors hover:bg-canvas-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateQrs}
                disabled={
                  validRows.length === 0 || exceedsQuota || isImporting
                }
                className="inline-flex items-center gap-2 rounded-lg bg-action-green px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>
                      Generating ({importProgress?.done ?? 0}/
                      {importProgress?.total ?? validRows.length})...
                    </span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span>
                      Generate {validRows.length}{" "}
                      {validRows.length === 1 ? "QR Code" : "QR Codes"}
                    </span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
