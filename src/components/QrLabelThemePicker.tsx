"use client";

import {
  QR_DOT_STYLES,
  QR_LABEL_THEMES,
  QR_THEME_COLORS,
  getQrThemeColorOption,
  type QrDotStyle,
  type QrLabelThemeId,
  type QrThemeColorId,
} from "@/lib/qr-label-themes";

interface LabelThemeThumbnailProps {
  themeId: QrLabelThemeId;
  accentHex: string;
}

function LabelThemeThumbnail({
  themeId,
  accentHex,
}: LabelThemeThumbnailProps) {
  if (themeId === "simple-tag") {
    return (
      <div className="flex h-16 w-14 flex-col overflow-hidden rounded border border-slate-300 bg-white shadow-2xs">
        <div
          className="h-3.5 w-full"
          style={{ backgroundColor: accentHex }}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-1 p-1">
          <div className="grid h-6 w-6 grid-cols-3 gap-0.5 rounded-xs border border-slate-200 p-0.5">
            <span className="bg-slate-800" />
            <span className="bg-slate-300" />
            <span className="bg-slate-800" />
            <span className="bg-slate-300" />
            <span className="bg-slate-800" />
            <span className="bg-slate-300" />
            <span className="bg-slate-800" />
            <span className="bg-slate-300" />
            <span className="bg-slate-800" />
          </div>
          <div className="h-1 w-8 rounded-full bg-slate-300" />
          <div className="h-0.5 w-6 rounded-full bg-slate-200" />
        </div>
      </div>
    );
  }

  if (themeId === "equipment-inspection") {
    return (
      <div
        className="flex h-16 w-14 flex-col items-center justify-between rounded-md p-1.5 shadow-2xs"
        style={{ backgroundColor: accentHex }}
      >
        <div className="h-1 w-9 rounded-full bg-white/85" />
        <div className="flex h-8 w-8 items-center justify-center rounded bg-white p-1">
          <div className="grid h-full w-full grid-cols-3 gap-0.5">
            <span className="bg-slate-800" />
            <span className="bg-slate-300" />
            <span className="bg-slate-800" />
            <span className="bg-slate-300" />
            <span className="bg-slate-800" />
            <span className="bg-slate-300" />
            <span className="bg-slate-800" />
            <span className="bg-slate-300" />
            <span className="bg-slate-800" />
          </div>
        </div>
        <div className="h-1 w-8 rounded-full bg-white/85" />
      </div>
    );
  }

  if (themeId === "horizontal-card") {
    return (
      <div className="relative flex h-12 w-18 items-center justify-between overflow-hidden rounded border border-slate-300 bg-white py-1.5 pr-1.5 pl-2.5 shadow-2xs">
        <div
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: accentHex }}
        />
        <div className="flex flex-col gap-1">
          <div
            className="h-1.5 w-5 rounded-xs opacity-80"
            style={{ backgroundColor: accentHex }}
          />
          <div className="h-1 w-6 rounded-full bg-slate-800" />
          <div className="h-0.5 w-5 rounded-full bg-slate-300" />
        </div>
        <div className="grid h-7 w-7 shrink-0 grid-cols-3 gap-0.5 rounded-xs border border-slate-200 p-0.5">
          <span className="bg-slate-800" />
          <span className="bg-slate-300" />
          <span className="bg-slate-800" />
          <span className="bg-slate-300" />
          <span className="bg-slate-800" />
          <span className="bg-slate-300" />
          <span className="bg-slate-800" />
          <span className="bg-slate-300" />
          <span className="bg-slate-800" />
        </div>
      </div>
    );
  }

  // classic
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded border border-slate-300 bg-white p-2 shadow-2xs">
      <div className="grid h-full w-full grid-cols-3 gap-1">
        <span className="bg-slate-900" />
        <span className="bg-slate-200" />
        <span className="bg-slate-900" />
        <span className="bg-slate-200" />
        <span className="bg-slate-900" />
        <span className="bg-slate-200" />
        <span className="bg-slate-900" />
        <span className="bg-slate-200" />
        <span className="bg-slate-900" />
      </div>
    </div>
  );
}

interface QrLabelThemeGridProps {
  selectedTheme: QrLabelThemeId;
  themeColor: QrThemeColorId;
  onSelectTheme: (theme: QrLabelThemeId) => void;
}

/** Visual 4-theme picker grid with live miniature thumbnails. */
export function QrLabelThemeGrid({
  selectedTheme,
  themeColor,
  onSelectTheme,
}: QrLabelThemeGridProps) {
  const accentHex = getQrThemeColorOption(themeColor).hex;

  return (
    <div className="grid grid-cols-2 gap-2">
      {QR_LABEL_THEMES.map((item) => {
        const isSelected = selectedTheme === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTheme(item.id)}
            aria-pressed={isSelected}
            className={`flex flex-col items-center gap-2 rounded-lg border p-2.5 text-center transition-colors ${
              isSelected
                ? "border-utility-blue bg-utility-blue/5 text-ink"
                : "border-border bg-surface text-ink-muted hover:border-slate-300 hover:text-ink"
            }`}
          >
            <div className="flex h-16 items-center justify-center">
              <LabelThemeThumbnail themeId={item.id} accentHex={accentHex} />
            </div>
            <div className="w-full">
              <p className="truncate text-xs font-semibold text-ink">
                {item.shortName}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[10px] text-ink-muted">
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface QrBeautifyControlsProps {
  themeColor: QrThemeColorId;
  dotStyle: QrDotStyle;
  onSelectColor: (color: QrThemeColorId) => void;
  onSelectDotStyle: (dotStyle: QrDotStyle) => void;
}

/** Lightweight accent color & QR dot style controls. */
export function QrBeautifyControls({
  themeColor,
  dotStyle,
  onSelectColor,
  onSelectDotStyle,
}: QrBeautifyControlsProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          Label Accent Color
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {QR_THEME_COLORS.map((color) => {
            const active = themeColor === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => onSelectColor(color.id)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                  active
                    ? "border-ink bg-canvas-muted text-ink"
                    : "border-border bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="truncate">{color.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          QR Module Style
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {QR_DOT_STYLES.map((style) => {
            const active = dotStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onSelectDotStyle(style.id)}
                aria-pressed={active}
                className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                  active
                    ? "border-ink bg-canvas-muted text-ink"
                    : "border-border bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                {style.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
