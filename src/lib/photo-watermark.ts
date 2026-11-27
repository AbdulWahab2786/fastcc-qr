const MAX_WATERMARK_WIDTH = 1440;
const JPEG_QUALITY = 0.82;
const GPS_TIMEOUT_MS = 4000;

function formatLocalTimestamp(date: Date): string {
  const formatted = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
}

function getGpsLabel(): Promise<string> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve("GPS: Unavailable");
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (label: string) => {
      if (settled) return;
      settled = true;
      resolve(label);
    };

    const guardTimer = setTimeout(() => {
      finish("GPS: Unavailable");
    }, GPS_TIMEOUT_MS + 250);

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(guardTimer);
          const lat = position.coords.latitude.toFixed(4);
          const lon = position.coords.longitude.toFixed(4);
          finish(`GPS: ${lat}, ${lon}`);
        },
        () => {
          clearTimeout(guardTimer);
          finish("GPS: Unavailable");
        },
        {
          enableHighAccuracy: true,
          timeout: GPS_TIMEOUT_MS,
          maximumAge: 60_000,
        },
      );
    } catch {
      clearTimeout(guardTimer);
      finish("GPS: Unavailable");
    }
  });
}

async function loadImageSource(file: File): Promise<{
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  cleanup: () => void;
}> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        width: bitmap.width,
        height: bitmap.height,
        draw: (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h),
        cleanup: () => bitmap.close(),
      };
    } catch {
      // Fall through to HTMLImageElement loader.
    }
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        draw: (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h),
        cleanup: () => URL.revokeObjectURL(objectUrl),
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not decode image file."));
    };
    img.src = objectUrl;
  });
}

function buildStampedFileName(originalName: string): string {
  const baseName = originalName.replace(/\.[^/.]+$/, "").trim() || "inspection";
  return `${baseName}-verified.jpg`;
}

/**
 * Stamps a captured frontline inspection photo with local date/time and GPS
 * coordinates on an offscreen HTML5 Canvas, resizing max width to 1440px and
 * exporting a compressed JPEG (0.82 quality). Falls back gracefully to the
 * original file if Canvas/image decoding is unavailable.
 */
export async function stampInspectionPhoto(file: File): Promise<File> {
  if (typeof document === "undefined") {
    return file;
  }

  try {
    const [gpsLabel, source] = await Promise.all([
      getGpsLabel(),
      loadImageSource(file),
    ]);

    try {
      const srcWidth = Math.max(1, source.width);
      const srcHeight = Math.max(1, source.height);
      const scale =
        srcWidth > MAX_WATERMARK_WIDTH ? MAX_WATERMARK_WIDTH / srcWidth : 1;
      const targetWidth = Math.round(srcWidth * scale);
      const targetHeight = Math.round(srcHeight * scale);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return file;
      }

      source.draw(ctx, targetWidth, targetHeight);

      const fontSize = Math.max(
        13,
        Math.min(28, Math.round(targetWidth * 0.022)),
      );
      const lineGap = Math.round(fontSize * 0.45);
      const padX = Math.max(14, Math.round(targetWidth * 0.02));
      const padY = Math.max(10, Math.round(fontSize * 0.75));
      const barHeight = padY * 2 + fontSize * 2 + lineGap;

      ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
      ctx.fillRect(0, targetHeight - barHeight, targetWidth, barHeight);

      ctx.fillStyle = "#ffffff";
      ctx.textBaseline = "top";

      const timestampText = formatLocalTimestamp(new Date());
      const metadataText = `${gpsLabel} • Verified by FastCC QR`;

      ctx.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.fillText(timestampText, padX, targetHeight - barHeight + padY);

      const subFontSize = Math.max(12, Math.round(fontSize * 0.9));
      ctx.font = `500 ${subFontSize}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
      ctx.fillText(
        metadataText,
        padX,
        targetHeight - barHeight + padY + fontSize + lineGap,
      );

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => resolve(result), "image/jpeg", JPEG_QUALITY);
      });

      if (!blob) {
        return file;
      }

      return new File([blob], buildStampedFileName(file.name), {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } finally {
      source.cleanup();
    }
  } catch {
    return file;
  }
}
