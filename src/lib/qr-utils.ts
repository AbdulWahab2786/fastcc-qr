import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { QrCodeRow } from "@/types/qr";

const SHORT_CODE_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
const LOCAL_STORAGE_KEY = "fastcc_local_qr_records_v1";

export interface TemplatePreset {
  id: string;
  title: string;
  category: string;
  description: string;
  subtitle: string;
  badge: string;
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "d2c-packing-sop",
    title: "D2C Packing SOP",
    category: "packing",
    description:
      "Box assembly, fragile item cushioning, invoice slip check, and tamper-seal verification before dispatch.",
    subtitle: "Scan for Packing Steps (EN / HI)",
    badge: "Fulfillment",
  },
  {
    id: "machine-maintenance-log",
    title: "Machine Maintenance Log",
    category: "maintenance",
    description:
      "Daily lubrication check, belt tension inspection, emergency stop test, and operator sign-off.",
    subtitle: "Scan to Log Daily Check",
    badge: "Shop Floor",
  },
  {
    id: "fixed-asset-tag",
    title: "Fixed Asset Tag",
    category: "asset",
    description:
      "Equipment serial tracking, calibration due date, assigned department, and issue reporting.",
    subtitle: "Scan for Asset History",
    badge: "Asset ID",
  },
  {
    id: "shift-attendance",
    title: "Shift Attendance",
    category: "attendance",
    description:
      "Line check-in, PPE compliance confirmation, and shift handover notes for incoming supervisors.",
    subtitle: "Scan for Shift Check-In",
    badge: "Workforce",
  },
];

/** Generates a URL-safe 8-character short_code without ambiguous characters. */
export function generateShortCode(length = 8): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += SHORT_CODE_ALPHABET[bytes[i] % SHORT_CODE_ALPHABET.length];
  }
  return code;
}

/** Builds the frontline worker scan URL for a given short_code. */
export function getQrScanUrl(shortCode: string, origin?: string): string {
  const resolvedOrigin =
    origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return resolvedOrigin ? `${resolvedOrigin}/q/${shortCode}` : `/q/${shortCode}`;
}

function readLocalRecords(): Record<string, QrCodeRow> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, QrCodeRow>;
  } catch {
    return {};
  }
}

export function saveLocalQrRecord(record: QrCodeRow): void {
  if (typeof window === "undefined") return;
  try {
    const existing = readLocalRecords();
    existing[record.short_code] = record;
    existing[record.id] = record;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Ignore storage quota or privacy-mode errors.
  }
}

export function getLocalQrRecord(idOrShortCode: string): QrCodeRow | null {
  const records = readLocalRecords();
  return records[idOrShortCode] ?? null;
}

export interface CreateGuestQrInput {
  title: string;
  description: string;
  category: string;
}

export interface CreateGuestQrResult {
  record: QrCodeRow;
  isLocalFallback: boolean;
  notice?: string;
}

/**
 * Inserts a guest QR record into Supabase (`user_id: null`, `show_watermark: true`).
 * Falls back to a local record if Supabase env vars are not configured or insert fails.
 */
export async function createGuestQrCode(
  input: CreateGuestQrInput,
): Promise<CreateGuestQrResult> {
  const shortCode = generateShortCode(8);
  const now = new Date().toISOString();
  const title = input.title.trim() || "Untitled Operations QR";
  const description = input.description.trim() || null;
  const category = input.category || "general";

  const localFallbackRecord: QrCodeRow = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `local-${shortCode}`,
    short_code: shortCode,
    user_id: null,
    title,
    description,
    category,
    type: "standard",
    config_json: {},
    show_watermark: true,
    created_at: now,
    updated_at: now,
  };

  if (!hasSupabaseEnv()) {
    saveLocalQrRecord(localFallbackRecord);
    return {
      record: localFallbackRecord,
      isLocalFallback: true,
      notice:
        "Supabase env vars not configured locally — running in local preview mode.",
    };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("qr_codes")
      .insert({
        short_code: shortCode,
        user_id: null,
        title,
        description,
        category,
        show_watermark: true,
      })
      .select()
      .single();

    if (error || !data) {
      saveLocalQrRecord(localFallbackRecord);
      return {
        record: localFallbackRecord,
        isLocalFallback: true,
        notice:
          error?.message ||
          "Could not reach Supabase — saved to local preview state.",
      };
    }

    saveLocalQrRecord(data);
    return {
      record: data,
      isLocalFallback: false,
    };
  } catch {
    saveLocalQrRecord(localFallbackRecord);
    return {
      record: localFallbackRecord,
      isLocalFallback: true,
      notice: "Supabase unavailable — saved to local preview state.",
    };
  }
}

/** Returns a safe fallback demo record when `/studio/demo` or an unknown local ID is opened. */
export function getDemoQrRecord(idOrCode: string): QrCodeRow {
  const preset =
    TEMPLATE_PRESETS.find((t) => t.id === idOrCode) ?? TEMPLATE_PRESETS[0];
  const now = new Date().toISOString();
  return {
    id: "00000000-0000-4000-8000-000000000001",
    short_code: idOrCode === "demo" ? "demo" : idOrCode.slice(0, 12),
    user_id: null,
    title: idOrCode === "demo" ? "D2C Packing Station #04" : preset.title,
    description: preset.description,
    category: preset.category,
    type: "standard",
    config_json: {},
    show_watermark: true,
    created_at: now,
    updated_at: now,
  };
}
