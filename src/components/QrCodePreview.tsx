"use client";

import { useEffect, useState } from "react";
import { generateQrDataUrl } from "@/lib/qr-export";
import {
  DEFAULT_QR_DOT_STYLE,
  DEFAULT_QR_LABEL_THEME,
  DEFAULT_QR_THEME_COLOR,
  getQrThemeColorOption,
  type QrDotStyle,
  type QrLabelThemeId,
  type QrThemeColorId,
} from "@/lib/qr-label-themes";

interface QrCodePreviewProps {
  value: string;
  size?: number;
  logoSrc?: string | null;
  showWatermark?: boolean;
  className?: string;
  theme?: QrLabelThemeId;
  themeColor?: QrThemeColorId;
  dotStyle?: QrDotStyle;
  title?: string;
  subtitle?: string;
  folder?: string;
  shortCode?: string;
  scheduleLabel?: string;
}

/** High-contrast QR code preview using ECC level H with optional centered logo overlay and CaoLiao-style label themes. */
export function QrCodePreview({
  value,
  size = 240,
  logoSrc = null,
  showWatermark = false,
  className = "",
  theme = DEFAULT_QR_LABEL_THEME,
  themeColor = DEFAULT_QR_THEME_COLOR,
  dotStyle = DEFAULT_QR_DOT_STYLE,
  title = "Operations SOP",
  subtitle = "Scan for SOP & Logs",
  folder = "",
  shortCode = "",
  scheduleLabel = "",
}: QrCodePreviewProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const colorOpt = getQrThemeColorOption(themeColor);

  useEffect(() => {
    let active = true;
    generateQrDataUrl(value, size * 2, dotStyle)
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {
        if (active) setDataUrl("");
      });

    return () => {
      active = false;
    };
  }, [value, size, dotStyle]);

  const qrBox = (boxSize: number) => (
    <div
      className="relative flex items-center justify-center bg-white"
      style={{ width: boxSize, height: boxSize }}
    >
      {dataUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={dataUrl}
          alt={`QR code for ${value}`}
          width={boxSize}
          height={boxSize}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-canvas-muted" />
      )}

      {logoSrc ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-[22%] w-[22%] items-center justify-center rounded-md border border-border bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="QR center logo"
              className="h-full w-full rounded-sm object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );

  const cleanFolder =
    folder.trim() && folder.trim().toLowerCase() !== "unassigned"
      ? folder.trim()
      : "";
  const cleanTitle = title.trim() || "Operations SOP";
  const cleanSubtitle = subtitle.trim() || "Scan for SOP & Logs";

  if (theme === "simple-tag") {
    const qrDim = Math.min(size, 184);
    return (
      <div
        className={`inline-flex w-full max-w-[270px] flex-col overflow-hidden rounded-xl border border-slate-300 bg-white text-center shadow-[0_1px_3px_rgba(15,23,42,0.06)] ${className}`}
      >
        <div
          className="px-4 py-3 text-white"
          style={{ backgroundColor: colorOpt.hex }}
        >
          <p className="line-clamp-2 text-sm font-bold leading-snug">
            {cleanTitle}
          </p>
          {shortCode ? (
            <p className="mt-1 font-mono text-[10px] font-semibold tracking-wide text-white/85">
              ID: {shortCode}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-center px-4 pt-4 pb-3.5">
          {qrBox(qrDim)}

          <div className="mt-3 w-full space-y-0.5 border-t border-slate-100 pt-2.5">
            <p className="truncate text-xs font-semibold text-ink">
              {cleanFolder || scheduleLabel || "Standard Operating Procedure"}
            </p>
            <p className="truncate text-[11px] text-ink-muted">
              {cleanSubtitle}
            </p>
          </div>

          {showWatermark ? (
            <p className="mt-2 text-[10px] font-semibold tracking-tight text-ink-muted">
              Powered by FastCC QR
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  if (theme === "equipment-inspection") {
    const qrDim = Math.min(size, 176);
    const metaLine = [cleanFolder, scheduleLabel].filter(Boolean).join(" • ");
    return (
      <div
        className={`relative inline-flex w-full max-w-[270px] flex-col items-center overflow-hidden rounded-2xl px-4 pt-4 pb-4 text-center text-white shadow-[0_2px_6px_rgba(15,23,42,0.1)] ${className}`}
        style={{ backgroundColor: colorOpt.hex }}
      >
        {/* Arched top accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 left-1/2 h-24 w-[130%] -translate-x-1/2 rounded-[100%] opacity-25"
          style={{ backgroundColor: colorOpt.darkHex }}
        />

        <div className="relative z-10 w-full">
          <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase">
            EQUIPMENT INSPECTION
          </p>
          {shortCode ? (
            <p className="mt-0.5 font-mono text-[10px] font-semibold text-white/80">
              ASSET ID: {shortCode}
            </p>
          ) : null}
        </div>

        <div className="relative z-10 mt-3 rounded-xl bg-white p-2.5 shadow-xs">
          {qrBox(qrDim)}
        </div>

        <div className="relative z-10 mt-3 w-full px-1">
          <p className="line-clamp-2 text-sm font-bold leading-snug text-white">
            {cleanTitle}
          </p>
          <p className="mt-1 truncate text-[11px] font-medium text-white/90">
            {metaLine || cleanSubtitle}
          </p>
        </div>

        {showWatermark ? (
          <p className="relative z-10 mt-2 text-[10px] font-semibold tracking-tight text-white/75">
            Powered by FastCC QR
          </p>
        ) : null}
      </div>
    );
  }

  if (theme === "horizontal-card") {
    const qrDim = Math.min(size, 136);
    return (
      <div
        className={`relative inline-flex w-full max-w-[360px] items-center justify-between gap-3.5 overflow-hidden rounded-xl border border-slate-300 bg-white py-3.5 pr-3.5 pl-5 text-left shadow-[0_1px_3px_rgba(15,23,42,0.06)] ${className}`}
      >
        {/* Left accent stripe */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-2"
          style={{ backgroundColor: colorOpt.hex }}
        />

        <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
          <div>
            <span
              className="inline-block max-w-full truncate rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase"
              style={{
                backgroundColor: colorOpt.tintHex,
                color: colorOpt.hex,
              }}
            >
              {cleanFolder || "ASSET / SOP"}
            </span>
            <p className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-ink">
              {cleanTitle}
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-ink-muted">
              {cleanSubtitle}
            </p>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 border-t border-slate-100 pt-2">
            {shortCode ? (
              <span className="font-mono text-[11px] font-bold text-ink">
                ID: {shortCode}
              </span>
            ) : null}
            {scheduleLabel ? (
              <span
                className="text-[10px] font-semibold"
                style={{ color: colorOpt.hex }}
              >
                • {scheduleLabel}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center">
          <div className="rounded-lg border border-border bg-white p-1.5">
            {qrBox(qrDim)}
          </div>
          {showWatermark ? (
            <span className="mt-1 text-[9px] font-semibold tracking-tight text-ink-muted">
              Powered by FastCC QR
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  // Default: "classic" (Plain QR)
  return (
    <div
      className={`inline-flex flex-col items-center overflow-hidden rounded-lg border border-border bg-white ${className}`}
    >
      {qrBox(size)}

      {showWatermark ? (
        <div className="w-full px-2 pb-1.5 text-center text-[10px] font-semibold leading-none tracking-tight text-ink-muted">
          Powered by FastCC QR
        </div>
      ) : null}
    </div>
  );
}
