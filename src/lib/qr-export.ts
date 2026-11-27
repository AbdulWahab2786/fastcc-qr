import QRCode from "qrcode";
import {
  DEFAULT_QR_DOT_STYLE,
  DEFAULT_QR_THEME_COLOR,
  getQrThemeColorOption,
  type QrDotStyle,
  type QrLabelThemeId,
  type QrThemeColorId,
} from "@/lib/qr-label-themes";

export type StudioLayoutPreset = "a4-poster" | "equipment-plate" | "thermal-sticker";

export interface StickerExportConfig {
  qrUrl: string;
  shortCode: string;
  title: string;
  subtitle: string;
  preset: StudioLayoutPreset;
  logoSrc: string | null;
  showWatermark: boolean;
}

export interface ThemedLabelExportConfig {
  qrUrl: string;
  shortCode: string;
  title: string;
  subtitle?: string;
  folder?: string;
  scheduleLabel?: string;
  theme: QrLabelThemeId;
  themeColor?: QrThemeColorId;
  dotStyle?: QrDotStyle;
  logoSrc?: string | null;
  showWatermark?: boolean;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 2,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i += 1) {
    const next = `${current} ${words[i]}`;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = words[i];
      if (lines.length === maxLines - 1) {
        break;
      }
    }
  }
  lines.push(current);
  return lines.slice(0, maxLines);
}

function drawContainedLogo(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  qrX: number,
  qrY: number,
  qrSize: number,
  pad: number,
): void {
  const boxSize = Math.round(qrSize * 0.22);
  const boxX = Math.round(qrX + (qrSize - boxSize) / 2);
  const boxY = Math.round(qrY + (qrSize - boxSize) / 2);

  ctx.fillStyle = "#FFFFFF";
  drawRoundedRect(
    ctx,
    boxX - pad,
    boxY - pad,
    boxSize + pad * 2,
    boxSize + pad * 2,
    16,
  );
  ctx.fill();
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 3;
  ctx.stroke();

  const naturalW = img.naturalWidth || boxSize;
  const naturalH = img.naturalHeight || boxSize;
  const scale = Math.min(boxSize / naturalW, boxSize / naturalH);
  const drawW = naturalW * scale;
  const drawH = naturalH * scale;
  const drawX = boxX + (boxSize - drawW) / 2;
  const drawY = boxY + (boxSize - drawH) / 2;

  ctx.save();
  drawRoundedRect(ctx, boxX, boxY, boxSize, boxSize, 12);
  ctx.clip();
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
}

/** Generates a crisp SVG string for a QR code with ECC level H. */
export async function generateQrSvgString(
  qrUrl: string,
  size = 512,
): Promise<string> {
  return QRCode.toString(qrUrl, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    width: size,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });
}

/** Downloads a standalone high-contrast QR code PNG (with optional centered logo). */
export async function downloadQrPng(
  qrUrl: string,
  filename: string,
  logoSrc: string | null = null,
): Promise<void> {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  await QRCode.toCanvas(canvas, qrUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: size,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });

  if (logoSrc) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      try {
        const img = await loadImage(logoSrc);
        drawContainedLogo(ctx, img, 0, 0, size, 12);
      } catch {
        // Skip logo overlay if image fails to load.
      }
    }
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );
  if (blob) {
    triggerDownload(blob, filename);
  }
}


/** Downloads a standalone high-contrast QR code SVG. */
export async function downloadQrSvg(
  qrUrl: string,
  filename: string,
): Promise<void> {
  const svgString = await generateQrSvgString(qrUrl, 512);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  triggerDownload(blob, filename);
}

/** Renders and downloads the full customized Studio sticker as a crisp PNG. */
export async function downloadStickerPng(
  config: StickerExportConfig,
  filename: string,
): Promise<void> {
  const dimensions: Record<StudioLayoutPreset, { w: number; h: number }> = {
    "a4-poster": { w: 1240, h: 1754 },
    "equipment-plate": { w: 1200, h: 900 },
    "thermal-sticker": { w: 720, h: 1080 },
  };
  const { w, h } = dimensions[config.preset];
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);

  // Outer frame
  const framePad = config.preset === "thermal-sticker" ? 28 : 48;
  ctx.strokeStyle =
    config.preset === "equipment-plate" ? "#0F172A" : "#CBD5E1";
  ctx.lineWidth = config.preset === "equipment-plate" ? 8 : 3;
  drawRoundedRect(
    ctx,
    framePad,
    framePad,
    w - framePad * 2,
    h - framePad * 2,
    config.preset === "thermal-sticker" ? 16 : 24,
  );
  ctx.stroke();

  // Top accent bar for equipment plate / poster
  if (config.preset !== "thermal-sticker") {
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(framePad, framePad, w - framePad * 2, 16);
  }

  // Title
  const titleFontSize =
    config.preset === "a4-poster"
      ? 60
      : config.preset === "equipment-plate"
        ? 44
        : 36;
  ctx.fillStyle = "#0F172A";
  ctx.font = `700 ${titleFontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  const maxTextWidth = w - framePad * 2 - 80;
  const titleLines = wrapCanvasText(ctx, config.title || "Operations SOP", maxTextWidth, 2);

  let cursorY =
    config.preset === "a4-poster"
      ? 180
      : config.preset === "equipment-plate"
        ? 145
        : 120;
  for (const line of titleLines) {
    ctx.fillText(line, w / 2, cursorY);
    cursorY += titleFontSize * 1.2;
  }

  // Subtitle
  const subFontSize =
    config.preset === "a4-poster"
      ? 32
      : config.preset === "equipment-plate"
        ? 24
        : 22;
  ctx.fillStyle = "#475569";
  ctx.font = `500 ${subFontSize}px system-ui, -apple-system, sans-serif`;
  const subLines = wrapCanvasText(
    ctx,
    config.subtitle || "Scan for step-by-step instructions",
    maxTextWidth,
    2,
  );
  cursorY += 12;
  for (const line of subLines) {
    ctx.fillText(line, w / 2, cursorY);
    cursorY += subFontSize * 1.3;
  }

  // QR Code
  const qrSize =
    config.preset === "a4-poster"
      ? 760
      : config.preset === "equipment-plate"
        ? 440
        : 520;
  const qrCanvas = document.createElement("canvas");
  qrCanvas.width = qrSize;
  qrCanvas.height = qrSize;
  await QRCode.toCanvas(qrCanvas, config.qrUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: qrSize,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });

  const watermarkBand = config.showWatermark
    ? config.preset === "a4-poster"
      ? 34
      : 26
    : 0;
  const qrX = Math.round((w - qrSize) / 2);
  const qrY =
    config.preset === "a4-poster"
      ? Math.round((h - qrSize - watermarkBand) / 2) + 20
      : config.preset === "equipment-plate"
        ? cursorY + 20
        : cursorY + 28;

  // Tight white quiet-zone/border box enclosing QR matrix + anti-crop watermark
  ctx.save();
  ctx.fillStyle = "#FFFFFF";
  drawRoundedRect(ctx, qrX, qrY, qrSize, qrSize + watermarkBand, 14);
  ctx.fill();
  ctx.clip();
  ctx.drawImage(qrCanvas, qrX, qrY);

  if (config.showWatermark) {
    ctx.fillStyle = "#475569";
    ctx.font = `600 ${config.preset === "a4-poster" ? 20 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(
      "Powered by FastCC QR",
      w / 2,
      qrY + qrSize + (config.preset === "a4-poster" ? 16 : 12),
    );
  }
  ctx.restore();

  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, qrX, qrY, qrSize, qrSize + watermarkBand, 14);
  ctx.stroke();

  // Logo overlay in center of QR
  if (config.logoSrc) {
    try {
      const logoImg = await loadImage(config.logoSrc);
      drawContainedLogo(ctx, logoImg, qrX, qrY, qrSize, 10);
    } catch {
      // Ignore logo load failures during export.
    }
  }

  // Short code pill
  const idY =
    qrY + qrSize + watermarkBand + (config.preset === "a4-poster" ? 60 : 42);
  ctx.fillStyle = "#0F172A";
  ctx.font = `700 ${config.preset === "a4-poster" ? 30 : 22}px ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.fillText(`ID: ${config.shortCode}`, w / 2, idY);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );
  if (blob) {
    triggerDownload(blob, filename);
  }
}

/** Draws a crisp QR code onto a canvas, supporting both sharp square and soft rounded modules. */
export async function drawQrToCanvas(
  canvas: HTMLCanvasElement,
  qrUrl: string,
  size: number,
  dotStyle: QrDotStyle = DEFAULT_QR_DOT_STYLE,
): Promise<void> {
  canvas.width = size;
  canvas.height = size;

  if (dotStyle === "square") {
    await QRCode.toCanvas(canvas, qrUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: size,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    });
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const qr = QRCode.create(qrUrl, { errorCorrectionLevel: "H" });
  const moduleCount = qr.modules.size;
  const marginModules = 2;
  const totalModules = moduleCount + marginModules * 2;
  const cellSize = size / totalModules;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "#0F172A";
  const isFinderCell = (r: number, c: number): boolean =>
    (r < 7 && c < 7) ||
    (r < 7 && c >= moduleCount - 7) ||
    (r >= moduleCount - 7 && c < 7);

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (!qr.modules.get(row, col)) continue;
      const x = (col + marginModules) * cellSize;
      const y = (row + marginModules) * cellSize;
      if (isFinderCell(row, col)) {
        ctx.fillRect(x, y, Math.ceil(cellSize), Math.ceil(cellSize));
      } else {
        const pad = cellSize * 0.08;
        const w = cellSize - pad * 2;
        const r = Math.max(1, w * 0.34);
        drawRoundedRect(ctx, x + pad, y + pad, w, w, r);
        ctx.fill();
      }
    }
  }
}

/** Generates a QR code data URL for previewing, supporting dotStyle. */
export async function generateQrDataUrl(
  qrUrl: string,
  size: number,
  dotStyle: QrDotStyle = DEFAULT_QR_DOT_STYLE,
): Promise<string> {
  if (dotStyle === "square") {
    return QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: size,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    });
  }
  const canvas = document.createElement("canvas");
  await drawQrToCanvas(canvas, qrUrl, size, dotStyle);
  return canvas.toDataURL("image/png");
}

function drawRoundedTopRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Renders and downloads a CaoLiao-style themed QR label card as a high-DPI PNG.
 * Falls back to `downloadQrPng` (with dotStyle) when `theme === "classic"`.
 */
export async function downloadThemedLabelPng(
  config: ThemedLabelExportConfig,
  filename: string,
): Promise<void> {
  const dotStyle = config.dotStyle ?? DEFAULT_QR_DOT_STYLE;
  const colorOpt = getQrThemeColorOption(
    config.themeColor ?? DEFAULT_QR_THEME_COLOR,
  );
  const titleText = config.title.trim() || "Operations SOP";
  const subtitleText = config.subtitle?.trim() || "Scan for SOP & Logs";
  const folderText = config.folder?.trim() || "";
  const scheduleText = config.scheduleLabel?.trim() || "";
  const showWatermark = Boolean(config.showWatermark);

  if (config.theme === "classic") {
    const size = 1024;
    const canvas = document.createElement("canvas");
    await drawQrToCanvas(canvas, config.qrUrl, size, dotStyle);
    if (config.logoSrc) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        try {
          const img = await loadImage(config.logoSrc);
          drawContainedLogo(ctx, img, 0, 0, size, 12);
        } catch {
          // Ignore logo load failures.
        }
      }
    }
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );
    if (blob) triggerDownload(blob, filename);
    return;
  }

  const qrCanvas = document.createElement("canvas");
  const isHorizontal = config.theme === "horizontal-card";
  const w = isHorizontal ? 1600 : 1200;
  const h = isHorizontal ? 960 : 1600;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Outer canvas background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);

  if (config.theme === "simple-tag") {
    // Card border
    const pad = 48;
    const cardW = w - pad * 2;
    const cardH = h - pad * 2;
    ctx.fillStyle = "#FFFFFF";
    drawRoundedRect(ctx, pad, pad, cardW, cardH, 36);
    ctx.fill();
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Solid accent top header bar
    const headerH = 260;
    ctx.save();
    drawRoundedTopRect(ctx, pad, pad, cardW, headerH, 36);
    ctx.fillStyle = colorOpt.hex;
    ctx.fill();
    ctx.restore();

    // Header title & ID pill
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 50px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    const titleLines = wrapCanvasText(ctx, titleText, cardW - 140, 2);
    let ty = pad + (titleLines.length > 1 ? 105 : 132);
    for (const line of titleLines) {
      ctx.fillText(line, w / 2, ty);
      ty += 60;
    }

    ctx.font = "600 26px ui-monospace, monospace";
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.fillText(`ID: ${config.shortCode}`, w / 2, pad + headerH - 36);

    // Centered QR
    const qrSize = 740;
    await drawQrToCanvas(qrCanvas, config.qrUrl, qrSize, dotStyle);
    const qrX = Math.round((w - qrSize) / 2);
    const qrY = pad + headerH + 85;
    ctx.drawImage(qrCanvas, qrX, qrY);

    if (config.logoSrc) {
      try {
        const logoImg = await loadImage(config.logoSrc);
        drawContainedLogo(ctx, logoImg, qrX, qrY, qrSize, 12);
      } catch {
        // Ignore logo load failures.
      }
    }

    // 2 clean caption lines below
    const captionBaseY = qrY + qrSize + 82;
    const line1 =
      folderText && folderText.toLowerCase() !== "unassigned"
        ? folderText
        : scheduleText || "Standard Operating Procedure";
    ctx.fillStyle = "#0F172A";
    ctx.font = "700 36px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(line1, w / 2, captionBaseY, cardW - 120);

    ctx.fillStyle = "#475569";
    ctx.font = "500 30px system-ui, -apple-system, sans-serif";
    ctx.fillText(subtitleText, w / 2, captionBaseY + 54, cardW - 120);

    if (showWatermark) {
      ctx.fillStyle = "#64748B";
      ctx.font = "600 24px system-ui, -apple-system, sans-serif";
      ctx.fillText("Powered by FastCC QR", w / 2, pad + cardH - 42);
    }
  } else if (config.theme === "equipment-inspection") {
    const pad = 48;
    const cardW = w - pad * 2;
    const cardH = h - pad * 2;

    // Bold accent outer frame with subtle arch
    ctx.fillStyle = colorOpt.hex;
    drawRoundedRect(ctx, pad, pad, cardW, cardH, 48);
    ctx.fill();

    // Subtle arched top highlight
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(w / 2, pad + 180, cardW * 0.62, 220, 0, Math.PI, 0);
    ctx.fillStyle = colorOpt.darkHex;
    ctx.globalAlpha = 0.25;
    ctx.fill();
    ctx.restore();

    // Top Header: EQUIPMENT INSPECTION
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 44px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("EQUIPMENT INSPECTION", w / 2, pad + 120);

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "600 26px ui-monospace, monospace";
    ctx.fillText(`ASSET ID: ${config.shortCode}`, w / 2, pad + 170);

    // Crisp white rounded QR box in the center
    const qrBoxPad = 48;
    const qrSize = 720;
    const qrBoxSize = qrSize + qrBoxPad * 2;
    const qrBoxX = Math.round((w - qrBoxSize) / 2);
    const qrBoxY = pad + 230;

    ctx.fillStyle = "#FFFFFF";
    drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 36);
    ctx.fill();

    await drawQrToCanvas(qrCanvas, config.qrUrl, qrSize, dotStyle);
    const qrX = qrBoxX + qrBoxPad;
    const qrY = qrBoxY + qrBoxPad;
    ctx.drawImage(qrCanvas, qrX, qrY);

    if (config.logoSrc) {
      try {
        const logoImg = await loadImage(config.logoSrc);
        drawContainedLogo(ctx, logoImg, qrX, qrY, qrSize, 12);
      } catch {
        // Ignore logo load failures.
      }
    }

    // Asset name + schedule/folder at the bottom
    const bottomY = qrBoxY + qrBoxSize + 96;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 48px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    const titleLines = wrapCanvasText(ctx, titleText, cardW - 140, 2);
    let cy = bottomY;
    for (const line of titleLines) {
      ctx.fillText(line, w / 2, cy);
      cy += 58;
    }

    const metaParts = [
      folderText && folderText.toLowerCase() !== "unassigned"
        ? folderText
        : "",
      scheduleText || "",
    ].filter(Boolean);
    const metaLine =
      metaParts.length > 0 ? metaParts.join("  •  ") : subtitleText;

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "500 30px system-ui, -apple-system, sans-serif";
    ctx.fillText(metaLine, w / 2, cy + 16, cardW - 140);

    if (showWatermark) {
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.font = "600 22px system-ui, -apple-system, sans-serif";
      ctx.fillText("Powered by FastCC QR", w / 2, pad + cardH - 36);
    }
  } else if (config.theme === "horizontal-card") {
    const pad = 56;
    const cardW = w - pad * 2;
    const cardH = h - pad * 2;

    // Card background + border
    ctx.fillStyle = "#FFFFFF";
    drawRoundedRect(ctx, pad, pad, cardW, cardH, 36);
    ctx.fill();
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Left accent stripe
    ctx.save();
    drawRoundedRect(ctx, pad, pad, cardW, cardH, 36);
    ctx.clip();
    ctx.fillStyle = colorOpt.hex;
    ctx.fillRect(pad, pad, 34, cardH);
    ctx.restore();

    // Right side QR code
    const qrSize = 620;
    const qrX = pad + cardW - qrSize - 80;
    const qrY = Math.round((h - qrSize) / 2);

    ctx.fillStyle = "#FFFFFF";
    drawRoundedRect(ctx, qrX - 24, qrY - 24, qrSize + 48, qrSize + 48, 24);
    ctx.fill();
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 3;
    ctx.stroke();

    await drawQrToCanvas(qrCanvas, config.qrUrl, qrSize, dotStyle);
    ctx.drawImage(qrCanvas, qrX, qrY);

    if (config.logoSrc) {
      try {
        const logoImg = await loadImage(config.logoSrc);
        drawContainedLogo(ctx, logoImg, qrX, qrY, qrSize, 12);
      } catch {
        // Ignore logo load failures.
      }
    }

    // Left side text
    const leftX = pad + 96;
    const leftMaxW = qrX - leftX - 72;

    // Folder / Category pill
    const pillText =
      folderText && folderText.toLowerCase() !== "unassigned"
        ? folderText.toUpperCase()
        : "ASSET / SOP LABEL";
    ctx.fillStyle = colorOpt.tintHex;
    drawRoundedRect(ctx, leftX, pad + 110, Math.min(leftMaxW, 440), 58, 14);
    ctx.fill();
    ctx.fillStyle = colorOpt.hex;
    ctx.font = "700 24px ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText(pillText, leftX + 24, pad + 148, Math.min(leftMaxW, 400));

    // Bold Asset Title
    ctx.fillStyle = "#0F172A";
    ctx.font = "700 62px system-ui, -apple-system, sans-serif";
    const titleLines = wrapCanvasText(ctx, titleText, leftMaxW, 3);
    let ty = pad + 260;
    for (const line of titleLines) {
      ctx.fillText(line, leftX, ty);
      ty += 76;
    }

    // Description / Subtitle
    ctx.fillStyle = "#475569";
    ctx.font = "500 32px system-ui, -apple-system, sans-serif";
    const subLines = wrapCanvasText(ctx, subtitleText, leftMaxW, 2);
    let sy = ty + 24;
    for (const line of subLines) {
      ctx.fillText(line, leftX, sy);
      sy += 44;
    }

    // Status / ID footer on left
    const footerY = pad + cardH - 110;
    ctx.fillStyle = "#0F172A";
    ctx.font = "700 32px ui-monospace, monospace";
    ctx.fillText(`ID: ${config.shortCode}`, leftX, footerY);

    if (scheduleText) {
      ctx.fillStyle = colorOpt.hex;
      ctx.font = "600 26px system-ui, -apple-system, sans-serif";
      ctx.fillText(scheduleText, leftX, footerY + 42);
    }

    if (showWatermark) {
      ctx.fillStyle = "#64748B";
      ctx.font = "600 22px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Powered by FastCC QR", qrX + qrSize / 2, qrY + qrSize + 52);
    }
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );
  if (blob) {
    triggerDownload(blob, filename);
  }
}

/** Generates and downloads a standalone SVG sticker with QR code, text, and optional watermark. */
export async function downloadStickerSvg(
  config: StickerExportConfig,
  filename: string,
): Promise<void> {
  const dimensions: Record<StudioLayoutPreset, { w: number; h: number }> = {
    "a4-poster": { w: 794, h: 1123 },
    "equipment-plate": { w: 800, h: 600 },
    "thermal-sticker": { w: 480, h: 720 },
  };
  const { w, h } = dimensions[config.preset];
  const qrSize =
    config.preset === "a4-poster"
      ? 480
      : config.preset === "equipment-plate"
        ? 290
        : 340;

  const rawQrSvg = await generateQrSvgString(config.qrUrl, qrSize);
  const innerSvgMatch = rawQrSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const viewBoxMatch = rawQrSvg.match(/viewBox="([^"]+)"/i);
  const qrInner = innerSvgMatch ? innerSvgMatch[1] : "";
  const qrViewBox = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${qrSize} ${qrSize}`;

  const qrX = Math.round((w - qrSize) / 2);
  const qrY =
    config.preset === "a4-poster"
      ? 310
      : config.preset === "equipment-plate"
        ? 175
        : 185;

  const titleSize =
    config.preset === "a4-poster"
      ? 38
      : config.preset === "equipment-plate"
        ? 30
        : 24;
  const subSize =
    config.preset === "a4-poster"
      ? 20
      : config.preset === "equipment-plate"
        ? 16
        : 15;

  const framePad = config.preset === "thermal-sticker" ? 20 : 32;
  const strokeColor =
    config.preset === "equipment-plate" ? "#0F172A" : "#CBD5E1";
  const strokeWidth = config.preset === "equipment-plate" ? 4 : 2;

  const watermarkBand = config.showWatermark ? 20 : 0;
  const watermarkSvg = config.showWatermark
    ? `<text x="${w / 2}" y="${qrY + qrSize + 10}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#475569">Powered by FastCC QR</text>`
    : "";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#FFFFFF"/>
  <rect x="${framePad}" y="${framePad}" width="${w - framePad * 2}" height="${h - framePad * 2}" rx="16" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
  <text x="${w / 2}" y="${framePad + 76}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${titleSize}" font-weight="700" fill="#0F172A">${escapeXml(config.title || "Operations SOP")}</text>
  <text x="${w / 2}" y="${framePad + 114}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${subSize}" font-weight="500" fill="#475569">${escapeXml(config.subtitle || "Scan for step-by-step instructions")}</text>
  <rect x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize + watermarkBand}" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <svg x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" viewBox="${qrViewBox}">
    ${qrInner}
  </svg>
  ${watermarkSvg}
  <text x="${w / 2}" y="${qrY + qrSize + watermarkBand + 32}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" font-weight="700" fill="#0F172A">ID: ${escapeXml(config.shortCode)}</text>
</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  triggerDownload(blob, filename);
}
