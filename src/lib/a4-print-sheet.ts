import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import type { Json, PlanTier } from "@/types/database";
import type { QrCodeRow } from "@/types/qr";

export type GridDensity = 8 | 12 | 16;

export interface A4PrintSheetOptions {
  qrs: QrCodeRow[];
  density: GridDensity;
  showCutLines: boolean;
  footerLabel: string;
  plan: PlanTier;
}

interface GridLayout {
  cols: number;
  rows: number;
  titleFontSizePt: number;
  footerFontSizePt: number;
}

const GRID_LAYOUTS: Record<GridDensity, GridLayout> = {
  8: { cols: 2, rows: 4, titleFontSizePt: 10.5, footerFontSizePt: 7.5 },
  12: { cols: 3, rows: 4, titleFontSizePt: 9.5, footerFontSizePt: 7.5 },
  16: { cols: 4, rows: 4, titleFontSizePt: 8.5, footerFontSizePt: 6.5 },
};

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_MARGIN_MM = 10;
const QR_RENDER_PX = 600;
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

function isJsonRecord(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractQrVisualConfig(configJson: Json): {
  darkColor: string;
  logoSrc: string | null;
} {
  if (!isJsonRecord(configJson)) {
    return { darkColor: "#0F172A", logoSrc: null };
  }

  const colorCandidate =
    configJson.qrColor ??
    configJson.color ??
    configJson.fgColor ??
    configJson.darkColor;
  const darkColor =
    typeof colorCandidate === "string" &&
    HEX_COLOR_PATTERN.test(colorCandidate.trim())
      ? colorCandidate.trim()
      : "#0F172A";

  const logoCandidate =
    configJson.logoSrc ??
    configJson.logoUrl ??
    configJson.customLogoDataUrl ??
    configJson.logo;
  const logoSrc =
    typeof logoCandidate === "string" && logoCandidate.trim().length > 0
      ? logoCandidate.trim()
      : null;

  return { darkColor, logoSrc };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load logo image: ${src}`));
    img.src = src;
  });
}

function drawCenteredLogo(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  qrSize: number,
): void {
  const boxSize = Math.round(qrSize * 0.22);
  const pad = 8;
  const boxX = Math.round((qrSize - boxSize) / 2);
  const boxY = Math.round((qrSize - boxSize) / 2);

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.roundRect(
    boxX - pad,
    boxY - pad,
    boxSize + pad * 2,
    boxSize + pad * 2,
    12,
  );
  ctx.fill();
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 2;
  ctx.stroke();

  const naturalW = img.naturalWidth || boxSize;
  const naturalH = img.naturalHeight || boxSize;
  const scale = Math.min(boxSize / naturalW, boxSize / naturalH);
  const drawW = naturalW * scale;
  const drawH = naturalH * scale;
  const drawX = boxX + (boxSize - drawW) / 2;
  const drawY = boxY + (boxSize - drawH) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxSize, boxSize, 8);
  ctx.clip();
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
}

async function renderQrPngDataUrl(
  scanUrl: string,
  darkColor: string,
  logoSrc: string | null,
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = QR_RENDER_PX;
  canvas.height = QR_RENDER_PX;

  await QRCode.toCanvas(canvas, scanUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: QR_RENDER_PX,
    color: {
      dark: darkColor,
      light: "#FFFFFF",
    },
  });

  if (logoSrc) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      try {
        const img = await loadImage(logoSrc);
        drawCenteredLogo(ctx, img, QR_RENDER_PX);
      } catch {
        // Proceed without logo if external/invalid image fails to load.
      }
    }
  }

  return canvas.toDataURL("image/png");
}

function truncateTextToWidth(
  doc: jsPDF,
  text: string,
  maxWidthMm: number,
): string {
  const cleaned = text.trim();
  if (!cleaned) return "";
  if (doc.getTextWidth(cleaned) <= maxWidthMm) return cleaned;

  const ellipsis = "...";
  let end = cleaned.length;
  while (end > 1 && doc.getTextWidth(cleaned.slice(0, end) + ellipsis) > maxWidthMm) {
    end -= 1;
  }
  return `${cleaned.slice(0, Math.max(1, end)).trimEnd()}${ellipsis}`;
}

/**
 * Generates and downloads a print-ready A4 Portrait (210mm x 297mm) PDF
 * containing the selected QR stickers laid out in an 8, 12, or 16-per-page grid.
 */
export async function generateA4StickerSheetPdf(
  options: A4PrintSheetOptions,
): Promise<void> {
  const { qrs, density, showCutLines, footerLabel, plan } = options;
  if (qrs.length === 0) return;

  const layout = GRID_LAYOUTS[density];
  const perPage = layout.cols * layout.rows;
  const usableW = A4_WIDTH_MM - PAGE_MARGIN_MM * 2;
  const usableH = A4_HEIGHT_MM - PAGE_MARGIN_MM * 2;
  const cellW = usableW / layout.cols;
  const cellH = usableH / layout.rows;
  const showWatermark = plan === "free";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const resolvedFooter = footerLabel.trim();

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  for (let index = 0; index < qrs.length; index += 1) {
    if (index > 0 && index % perPage === 0) {
      doc.addPage();
    }

    const qr = qrs[index];
    const slot = index % perPage;
    const col = slot % layout.cols;
    const row = Math.floor(slot / layout.cols);

    const cellX = PAGE_MARGIN_MM + col * cellW;
    const cellY = PAGE_MARGIN_MM + row * cellH;
    const centerX = cellX + cellW / 2;
    const maxTextWidth = cellW - 7;

    if (showCutLines) {
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.25);
      doc.setLineDashPattern([2, 2], 0);
      doc.rect(cellX, cellY, cellW, cellH);
      doc.setLineDashPattern([], 0);
    }

    // Asset Title (bold, truncated cleanly)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(layout.titleFontSizePt);
    doc.setTextColor(15, 23, 42);
    const title = truncateTextToWidth(
      doc,
      qr.title || "Operations QR",
      maxTextWidth,
    );
    doc.text(title, centerX, cellY + 7.5, { align: "center" });

    // High-DPI QR Code
    const qrTop = cellY + 11;
    const qrBottom = showWatermark ? cellY + cellH - 12.5 : cellY + cellH - 10;
    const availableQrH = qrBottom - qrTop;
    const qrSizeMm = Math.min(cellW - 8, availableQrH);
    const qrX = cellX + (cellW - qrSizeMm) / 2;
    const qrY = qrTop + (availableQrH - qrSizeMm) / 2;

    const scanPath = `/q/${qr.short_code || qr.id}`;
    const scanUrl = origin ? `${origin}${scanPath}` : scanPath;
    const { darkColor, logoSrc } = extractQrVisualConfig(qr.config_json);
    const qrDataUrl = await renderQrPngDataUrl(scanUrl, darkColor, logoSrc);

    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSizeMm, qrSizeMm);

    // Footer Label below QR
    if (resolvedFooter) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(layout.footerFontSizePt);
      doc.setTextColor(51, 65, 85);
      const labelY = showWatermark ? cellY + cellH - 8 : cellY + cellH - 5;
      const truncatedFooter = truncateTextToWidth(
        doc,
        resolvedFooter,
        maxTextWidth,
      );
      doc.text(truncatedFooter, centerX, labelY, { align: "center" });
    }

    // Plan-based Watermark
    if (showWatermark) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Powered by FastCC QR", centerX, cellY + cellH - 3.5, {
        align: "center",
      });
    }
  }

  doc.save("fastcc-qr-a4-stickers.pdf");
}
