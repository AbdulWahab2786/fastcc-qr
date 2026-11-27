import { jsPDF } from "jspdf";
import { getAuditPdfMaxLogs } from "@/lib/billing/constants";
import type { EquipmentStatus, Json, PlanTier } from "@/types/database";
import type { InspectionLogRow, QrCodeRow } from "@/types/qr";

export type AuditDateRange = "7d" | "30d" | "all";

export const AUDIT_DATE_RANGE_OPTIONS: {
  id: AuditDateRange;
  label: string;
}[] = [
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "all", label: "All Time" },
];

const SIGNATURE_DATA_URL_PATTERN =
  /^data:image\/png;base64,[A-Za-z0-9+/=]+$/;
const SAFE_HTTP_URL_PATTERN = /^https?:\/\//i;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_X_MM = 14;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_X_MM * 2;
const PAGE_BOTTOM_LIMIT_MM = A4_HEIGHT_MM - 19;

function isJsonRecord(
  value: Json | unknown,
): value is Record<string, Json | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Extracts a validated compact PNG data URL from inspection_logs.step_results. */
export function extractSignatureDataUrl(stepResults: Json): string | null {
  if (!isJsonRecord(stepResults)) return null;
  const candidate = stepResults._signature_data_url;
  if (
    typeof candidate === "string" &&
    SIGNATURE_DATA_URL_PATTERN.test(candidate.trim())
  ) {
    return candidate.trim();
  }
  return null;
}

/** Normalizes equipment status across legacy and Phase 8+ inspection rows. */
export function resolveLogEquipmentStatus(
  log: Pick<InspectionLogRow, "equipment_status" | "status">,
): EquipmentStatus {
  if (
    log.equipment_status === "ok" ||
    log.equipment_status === "maintenance" ||
    log.equipment_status === "faulty"
  ) {
    return log.equipment_status;
  }
  if (log.status === "issue") return "maintenance";
  if (log.status === "fail") return "faulty";
  return "ok";
}

/** Builds a concise, human-readable summary of checklist or form entries. */
export function formatStepResultsSummary(stepResults: Json): string {
  if (!isJsonRecord(stepResults)) return "";

  const parts: string[] = [];

  if (Array.isArray(stepResults.checklist_results)) {
    const items = stepResults.checklist_results.filter(isJsonRecord);
    if (items.length > 0) {
      const passedCount = items.filter((item) => item.checked === true).length;
      const missingLabels = items
        .filter((item) => item.checked !== true && typeof item.label === "string")
        .map((item) => String(item.label).trim())
        .filter(Boolean);

      if (missingLabels.length > 0) {
        parts.push(
          `Checklist: ${passedCount}/${items.length} checked (Unchecked: ${missingLabels.slice(0, 2).join(", ")}${missingLabels.length > 2 ? "..." : ""})`,
        );
      } else {
        parts.push(`Checklist: ${passedCount}/${items.length} passed`);
      }
    }
  }

  if (isJsonRecord(stepResults.form_values)) {
    const entries = Object.entries(stepResults.form_values)
      .filter(([, val]) => typeof val === "string" && val.trim().length > 0)
      .map(([key, val]) => `${key}: ${String(val).trim()}`);
    if (entries.length > 0) {
      const preview = entries.slice(0, 3).join(", ");
      parts.push(
        `Form: ${preview}${entries.length > 3 ? ` (+${entries.length - 3} more)` : ""}`,
      );
    }
  }

  return parts.join(" | ");
}

/** Filters inspection logs according to the selected quick date range. */
export function filterLogsByDateRange(
  logs: InspectionLogRow[],
  range: AuditDateRange,
  nowMs: number = Date.now(),
): InspectionLogRow[] {
  if (range === "all") return logs;
  const days = range === "7d" ? 7 : 30;
  const cutoffMs = nowMs - days * MS_PER_DAY;
  return logs.filter((log) => {
    const parsed = Date.parse(log.created_at);
    return Number.isFinite(parsed) && parsed >= cutoffMs;
  });
}

function formatShortDate(isoOrMs: string | number): string {
  const date = new Date(isoOrMs);
  if (Number.isNaN(date.getTime())) return String(isoOrMs);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\b(am|pm)\b/gi, (m) => m.toUpperCase());
}

/** Builds a clean audit date range label suitable for PDF report headers. */
export function getAuditDateRangeLabel(
  range: AuditDateRange,
  logs: InspectionLogRow[] = [],
): string {
  const baseLabel =
    AUDIT_DATE_RANGE_OPTIONS.find((opt) => opt.id === range)?.label ??
    "All Time";

  if (logs.length === 0) return baseLabel;

  const timestamps = logs
    .map((log) => Date.parse(log.created_at))
    .filter((ms) => Number.isFinite(ms))
    .sort((a, b) => a - b);

  if (timestamps.length === 0) return baseLabel;

  const first = formatShortDate(timestamps[0]);
  const last = formatShortDate(timestamps[timestamps.length - 1]);
  return first === last
    ? `${baseLabel} (${first})`
    : `${baseLabel} (${first} - ${last})`;
}

/** Sanitizes an asset title into a filesystem-safe slug for exported filenames. */
export function sanitizeAuditFilenamePart(
  title: string,
  fallback = "asset",
): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || fallback;
}

function toPdfAscii(text: string): string {
  return text
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E\r\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getStatusDisplay(status: EquipmentStatus): {
  label: string;
  rgb: [number, number, number];
  bgRgb: [number, number, number];
} {
  switch (status) {
    case "faulty":
      return {
        label: "FAULTY",
        rgb: [220, 38, 38],
        bgRgb: [254, 242, 242],
      };
    case "maintenance":
      return {
        label: "MAINTENANCE",
        rgb: [180, 83, 9],
        bgRgb: [255, 251, 235],
      };
    case "ok":
    default:
      return {
        label: "OK",
        rgb: [22, 163, 74],
        bgRgb: [240, 253, 244],
      };
  }
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface AuditPdfExportOptions {
  dateRangeLabel?: string;
}

/**
 * Generates and downloads an executive A4 Compliance Audit Report PDF
 * (FSSAI / ISO ready) with KPI summary, chronological logs, photo links,
 * embedded worker digital signatures, and plan-gated FastCC QR footer.
 */
export function exportAuditReportPdf(
  qr: QrCodeRow,
  logs: InspectionLogRow[],
  plan: PlanTier,
  options?: AuditPdfExportOptions,
): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const sortedLogs = [...logs].sort(
    (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
  );
  const maxLogs = getAuditPdfMaxLogs(plan);
  const isFreePlan = maxLogs !== null;
  const visibleLogs =
    maxLogs !== null ? sortedLogs.slice(-maxLogs) : sortedLogs;

  let okCount = 0;
  let maintenanceCount = 0;
  let faultyCount = 0;
  for (const log of visibleLogs) {
    const eqStatus = resolveLogEquipmentStatus(log);
    if (eqStatus === "ok") okCount += 1;
    else if (eqStatus === "maintenance") maintenanceCount += 1;
    else faultyCount += 1;
  }

  const assetTitle = toPdfAscii(qr.title || "Operations Asset");
  const shortCode = toPdfAscii(qr.short_code || qr.id);
  const category = toPdfAscii(qr.category || "general");
  const generatedLabel = formatDateTime(new Date().toISOString());
  const dateRangeLabel = toPdfAscii(
    options?.dateRangeLabel ?? getAuditDateRangeLabel("all", visibleLogs),
  );
  const currentStatusMeta = getStatusDisplay(qr.current_status ?? "ok");

  // Top accent bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, A4_WIDTH_MM, 3.5, "F");

  // Executive Header
  let cursorY = 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(37, 99, 235);
  doc.text("FSSAI / ISO COMPLIANCE AUDIT RECORD", MARGIN_X_MM, cursorY);

  // Current Status Badge on Top Right
  const badgeW = 34;
  const badgeH = 7;
  const badgeX = A4_WIDTH_MM - MARGIN_X_MM - badgeW;
  const badgeY = cursorY - 4.5;
  doc.setFillColor(...currentStatusMeta.bgRgb);
  doc.setDrawColor(...currentStatusMeta.rgb);
  doc.setLineWidth(0.3);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...currentStatusMeta.rgb);
  doc.text(currentStatusMeta.label, badgeX + badgeW / 2, badgeY + 4.7, {
    align: "center",
  });

  cursorY += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("FastCC QR Audit Report", MARGIN_X_MM, cursorY);

  cursorY += 6.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  const wrappedTitle = doc.splitTextToSize(
    `Asset: ${assetTitle}`,
    CONTENT_WIDTH_MM - 40,
  ) as string[];
  doc.text(wrappedTitle.slice(0, 2), MARGIN_X_MM, cursorY);
  cursorY += Math.max(1, Math.min(2, wrappedTitle.length)) * 4.8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Asset ID: ${shortCode}   |   Category: ${category.toUpperCase()}`,
    MARGIN_X_MM,
    cursorY,
  );

  cursorY += 4.5;
  doc.text(
    `Generated: ${generatedLabel}   |   Date Range: ${dateRangeLabel}`,
    MARGIN_X_MM,
    cursorY,
  );

  if (isFreePlan) {
    cursorY += 4.5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9);
    doc.text(
      `Free Preview (Limited to latest ${maxLogs} logs) - Upgrade to Pro for full audit history & clean PDF.`,
      MARGIN_X_MM,
      cursorY,
    );
  }

  cursorY += 4.5;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_X_MM, cursorY, A4_WIDTH_MM - MARGIN_X_MM, cursorY);

  // Summary KPI Strip
  cursorY += 5;
  const kpiGap = 3;
  const kpiWidth = (CONTENT_WIDTH_MM - kpiGap * 3) / 4;
  const kpiHeight = 16.5;
  const kpiCards: {
    label: string;
    value: number;
    rgb: [number, number, number];
  }[] = [
    { label: "TOTAL INSPECTIONS", value: visibleLogs.length, rgb: [15, 23, 42] },
    { label: "OK", value: okCount, rgb: [22, 163, 74] },
    { label: "MAINTENANCE", value: maintenanceCount, rgb: [180, 83, 9] },
    { label: "FAULTY", value: faultyCount, rgb: [220, 38, 38] },
  ];

  kpiCards.forEach((card, index) => {
    const x = MARGIN_X_MM + index * (kpiWidth + kpiGap);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, cursorY, kpiWidth, kpiHeight, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(card.label, x + 3, cursorY + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...card.rgb);
    doc.text(String(card.value), x + 3, cursorY + 12.8);
  });

  cursorY += kpiHeight + 7;

  // Table Geometry (Total = 182mm)
  const cols = {
    date: { x: MARGIN_X_MM, w: 28 },
    worker: { x: MARGIN_X_MM + 28, w: 28 },
    status: { x: MARGIN_X_MM + 56, w: 23 },
    notes: { x: MARGIN_X_MM + 79, w: 57 },
    signature: { x: MARGIN_X_MM + 136, w: 46 },
  };

  function drawTableHeader(y: number): number {
    const headerH = 8;
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(MARGIN_X_MM, y, CONTENT_WIDTH_MM, headerH, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text("DATE & TIME", cols.date.x + 2, y + 5.2);
    doc.text("WORKER", cols.worker.x + 2, y + 5.2);
    doc.text("STATUS", cols.status.x + 2, y + 5.2);
    doc.text("NOTES & CHECKLIST", cols.notes.x + 2, y + 5.2);
    doc.text("SIGNATURE", cols.signature.x + 2, y + 5.2);
    return y + headerH;
  }

  cursorY = drawTableHeader(cursorY);

  if (visibleLogs.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "No inspection logs recorded in this date range.",
      A4_WIDTH_MM / 2,
      cursorY + 14,
      { align: "center" },
    );
  } else {
    for (let idx = 0; idx < visibleLogs.length; idx += 1) {
      const log = visibleLogs[idx];
      const eqStatus = resolveLogEquipmentStatus(log);
      const statusMeta = getStatusDisplay(eqStatus);
      const signatureUrl = extractSignatureDataUrl(log.step_results);
      const stepSummary = formatStepResultsSummary(log.step_results);
      const rawNotes = log.notes?.trim() ?? "";
      const combinedDetail = toPdfAscii(
        [rawNotes, stepSummary].filter(Boolean).join(" | ") ||
          "No notes recorded.",
      );
      const safePhotoUrl =
        log.photo_url && SAFE_HTTP_URL_PATTERN.test(log.photo_url.trim())
          ? log.photo_url.trim()
          : null;

      const dateObj = new Date(log.created_at);
      const dateStr = Number.isNaN(dateObj.getTime())
        ? toPdfAscii(log.created_at)
        : formatShortDate(log.created_at);
      const timeStr = Number.isNaN(dateObj.getTime())
        ? ""
        : dateObj
            .toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .toUpperCase();

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const workerLines = doc.splitTextToSize(
        toPdfAscii(log.inspector_name || "Worker"),
        cols.worker.w - 4,
      ) as string[];
      const noteLines = doc.splitTextToSize(
        combinedDetail,
        cols.notes.w - 4,
      ) as string[];

      const lineH = 3.8;
      const textBlockHeight =
        Math.max(
          timeStr ? 2 : 1,
          workerLines.length,
          noteLines.length + (safePhotoUrl ? 1.3 : 0),
        ) * lineH;
      const sigHeight = signatureUrl ? 15 : 0;
      const rowHeight = Math.max(14, textBlockHeight + 6, sigHeight + 5);

      if (cursorY + rowHeight > PAGE_BOTTOM_LIMIT_MM) {
        doc.addPage();
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, A4_WIDTH_MM, 2.5, "F");
        cursorY = 12;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(
          `FastCC QR Audit Report - ${assetTitle} (continued)`,
          MARGIN_X_MM,
          cursorY,
        );
        cursorY += 5;
        cursorY = drawTableHeader(cursorY);
      }

      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(MARGIN_X_MM, cursorY, CONTENT_WIDTH_MM, rowHeight, "F");
      }

      // Row border
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.25);
      doc.rect(MARGIN_X_MM, cursorY, CONTENT_WIDTH_MM, rowHeight, "S");

      const topTextY = cursorY + 4.8;

      // Date & Time
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.8);
      doc.setTextColor(15, 23, 42);
      doc.text(dateStr, cols.date.x + 2, topTextY);
      if (timeStr) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(timeStr, cols.date.x + 2, topTextY + 3.8);
      }

      // Worker Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(workerLines, cols.worker.x + 2, topTextY);

      // Status Pill
      const pillW = cols.status.w - 4;
      const pillH = 5.5;
      doc.setFillColor(...statusMeta.bgRgb);
      doc.setDrawColor(...statusMeta.rgb);
      doc.setLineWidth(0.25);
      doc.roundedRect(
        cols.status.x + 2,
        cursorY + 2.6,
        pillW,
        pillH,
        1,
        1,
        "FD",
      );
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.6);
      doc.setTextColor(...statusMeta.rgb);
      doc.text(
        statusMeta.label,
        cols.status.x + 2 + pillW / 2,
        cursorY + 6.2,
        { align: "center" },
      );

      // Notes & Checklist + Photo Proof link
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.8);
      doc.setTextColor(51, 65, 85);
      doc.text(noteLines, cols.notes.x + 2, topTextY);

      if (safePhotoUrl) {
        const linkY = topTextY + noteLines.length * lineH + 0.8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(37, 99, 235);
        doc.textWithLink("View Photo Proof", cols.notes.x + 2, linkY, {
          url: safePhotoUrl,
        });
      }

      // Worker Signature Image
      if (signatureUrl) {
        const boxX = cols.signature.x + 2.5;
        const boxY = cursorY + 2.5;
        const boxW = cols.signature.w - 5;
        const boxH = 14;
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.roundedRect(boxX, boxY, boxW, boxH, 1, 1, "FD");

        try {
          const props = doc.getImageProperties(signatureUrl);
          const imgW = Math.max(1, props.width);
          const imgH = Math.max(1, props.height);
          const scale = Math.min((boxW - 2) / imgW, (boxH - 2) / imgH);
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          const drawX = boxX + (boxW - drawW) / 2;
          const drawY = boxY + (boxH - drawH) / 2;
          doc.addImage(signatureUrl, "PNG", drawX, drawY, drawW, drawH);
        } catch {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139);
          doc.text("Signed", boxX + boxW / 2, boxY + 8.5, { align: "center" });
        }
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text("Not signed", cols.signature.x + 2.5, topTextY);
      }

      cursorY += rowHeight;
    }
  }

  // Page numbers & plan-based subtle footer on every page
  const totalPages = doc.getNumberOfPages();

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(MARGIN_X_MM, 283, A4_WIDTH_MM - MARGIN_X_MM, 283);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);

    if (isFreePlan) {
      doc.text(
        `Free Preview (Limited to latest ${maxLogs} logs) - Powered by FastCC QR. Upgrade to Pro for full audit history & clean PDF.`,
        MARGIN_X_MM,
        288,
      );
    }

    doc.text(
      `Page ${page} of ${totalPages}`,
      A4_WIDTH_MM - MARGIN_X_MM,
      288,
      { align: "right" },
    );
  }

  const slug = sanitizeAuditFilenamePart(qr.title, qr.short_code || "asset");
  doc.save(`fastcc-audit-${slug}.pdf`);
}

/**
 * Exports chronological inspection logs for a single asset as RFC-4180 CSV.
 */
export function exportAuditReportCsv(
  qr: QrCodeRow,
  logs: InspectionLogRow[],
): void {
  const sortedLogs = [...logs].sort(
    (a, b) => Date.parse(a.created_at) - Date.parse(b.created_at),
  );

  const header = [
    "Date/Time",
    "Asset Title",
    "Worker Name",
    "Equipment Status",
    "Notes",
    "Photo Proof URL",
    "Signed",
  ];

  const rows = sortedLogs.map((log) => {
    const eqStatus = resolveLogEquipmentStatus(log);
    const statusLabel =
      eqStatus === "ok"
        ? "OK"
        : eqStatus === "maintenance"
          ? "Maintenance"
          : "Faulty";
    const stepSummary = formatStepResultsSummary(log.step_results);
    const combinedNotes = [log.notes?.trim() ?? "", stepSummary]
      .filter(Boolean)
      .join(" | ");
    const signedLabel = extractSignatureDataUrl(log.step_results)
      ? "Yes"
      : "No";

    return [
      log.created_at,
      qr.title,
      log.inspector_name,
      statusLabel,
      combinedNotes,
      log.photo_url ?? "",
      signedLabel,
    ]
      .map((cell) => escapeCsvCell(String(cell)))
      .join(",");
  });

  const csvContent = [header.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const slug = sanitizeAuditFilenamePart(qr.title, qr.short_code || "asset");
  triggerFileDownload(blob, `fastcc-audit-${slug}.csv`);
}
