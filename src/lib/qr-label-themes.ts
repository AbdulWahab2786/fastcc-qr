import type { Json } from "@/types/database";

export type QrLabelThemeId =
  | "classic"
  | "simple-tag"
  | "equipment-inspection"
  | "horizontal-card";

export type QrThemeColorId =
  | "industrial-blue"
  | "safety-red"
  | "factory-dark"
  | "emerald-green";

export type QrDotStyle = "square" | "rounded";

export interface QrLabelThemeOption {
  id: QrLabelThemeId;
  name: string;
  shortName: string;
  description: string;
  orientation: "square" | "portrait" | "landscape";
}

export interface QrThemeColorOption {
  id: QrThemeColorId;
  label: string;
  hex: string;
  darkHex: string;
  tintHex: string;
}

export const QR_LABEL_THEMES: readonly QrLabelThemeOption[] = [
  {
    id: "classic",
    name: "Plain QR",
    shortName: "Plain QR",
    description: "Clean minimal QR code only",
    orientation: "square",
  },
  {
    id: "simple-tag",
    name: "Simple Industrial Tag",
    shortName: "Simple Tag",
    description: "Solid header bar, centered QR, and 2 caption lines",
    orientation: "portrait",
  },
  {
    id: "equipment-inspection",
    name: "Equipment Inspection Card",
    shortName: "Inspection",
    description: "Arched industrial frame with Equipment Inspection header",
    orientation: "portrait",
  },
  {
    id: "horizontal-card",
    name: "Horizontal Asset Label",
    shortName: "Horizontal",
    description: "Landscape card with title & ID left, QR right",
    orientation: "landscape",
  },
] as const;

export const QR_THEME_COLORS: readonly QrThemeColorOption[] = [
  {
    id: "industrial-blue",
    label: "Industrial Blue",
    hex: "#2563EB",
    darkHex: "#1E40AF",
    tintHex: "#EFF6FF",
  },
  {
    id: "safety-red",
    label: "Safety Red",
    hex: "#DC2626",
    darkHex: "#991B1B",
    tintHex: "#FEF2F2",
  },
  {
    id: "factory-dark",
    label: "Factory Dark",
    hex: "#0F172A",
    darkHex: "#020617",
    tintHex: "#F1F5F9",
  },
  {
    id: "emerald-green",
    label: "Emerald Green",
    hex: "#16A34A",
    darkHex: "#166534",
    tintHex: "#F0FDF4",
  },
] as const;

export const QR_DOT_STYLES: readonly { id: QrDotStyle; label: string }[] = [
  { id: "square", label: "Sharp Square" },
  { id: "rounded", label: "Soft Rounded" },
] as const;

export const DEFAULT_QR_LABEL_THEME: QrLabelThemeId = "classic";
export const DEFAULT_QR_THEME_COLOR: QrThemeColorId = "industrial-blue";
export const DEFAULT_QR_DOT_STYLE: QrDotStyle = "square";

export function normalizeQrLabelTheme(value: unknown): QrLabelThemeId {
  switch (value) {
    case "classic":
    case "simple-tag":
    case "equipment-inspection":
    case "horizontal-card":
      return value;
    default:
      return DEFAULT_QR_LABEL_THEME;
  }
}

export function normalizeQrThemeColor(value: unknown): QrThemeColorId {
  switch (value) {
    case "industrial-blue":
    case "safety-red":
    case "factory-dark":
    case "emerald-green":
      return value;
    default:
      return DEFAULT_QR_THEME_COLOR;
  }
}

export function normalizeQrDotStyle(value: unknown): QrDotStyle {
  switch (value) {
    case "square":
    case "rounded":
      return value;
    default:
      return DEFAULT_QR_DOT_STYLE;
  }
}

export function getQrThemeColorOption(
  id: QrThemeColorId,
): QrThemeColorOption {
  return (
    QR_THEME_COLORS.find((color) => color.id === id) ?? QR_THEME_COLORS[0]
  );
}

export function getQrLabelThemeOption(
  id: QrLabelThemeId,
): QrLabelThemeOption {
  return (
    QR_LABEL_THEMES.find((theme) => theme.id === id) ?? QR_LABEL_THEMES[0]
  );
}

function isConfigRecord(
  value: unknown,
): value is Record<string, Json | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export interface ExtractedLabelThemeConfig {
  labelTheme: QrLabelThemeId;
  themeColor: QrThemeColorId;
  dotStyle: QrDotStyle;
}

/** Extracts persisted label theme settings from `qr_codes.config_json`. */
export function extractLabelThemeFromConfig(
  config: Json | unknown,
): ExtractedLabelThemeConfig {
  if (!isConfigRecord(config)) {
    return {
      labelTheme: DEFAULT_QR_LABEL_THEME,
      themeColor: DEFAULT_QR_THEME_COLOR,
      dotStyle: DEFAULT_QR_DOT_STYLE,
    };
  }
  return {
    labelTheme: normalizeQrLabelTheme(config.label_theme),
    themeColor: normalizeQrThemeColor(config.theme_color),
    dotStyle: normalizeQrDotStyle(config.dot_style),
  };
}
