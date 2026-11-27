import {
  FREE_QR_LIMIT,
  isPaidPlan,
  resolveEffectivePlan,
} from "@/lib/billing/constants";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Json } from "@/types/database";
import type { InspectionLogInsert, QrCodeRow, SopStepRow } from "@/types/qr";

const SHORT_CODE_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
const LOCAL_STORAGE_KEY = "fastcc_local_qr_records_v1";
const LOCAL_STEPS_STORAGE_KEY = "fastcc_local_sop_steps_v1";
const LOCAL_LOGS_STORAGE_KEY = "fastcc_local_inspection_logs_v1";

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

let cachedRecordsRaw: string | null = null;
let cachedRecordsMap: Record<string, QrCodeRow> = {};

function readLocalRecords(): Record<string, QrCodeRow> {
  if (typeof window === "undefined") return cachedRecordsMap;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      cachedRecordsRaw = null;
      cachedRecordsMap = {};
      return cachedRecordsMap;
    }
    if (raw === cachedRecordsRaw) {
      return cachedRecordsMap;
    }
    cachedRecordsRaw = raw;
    cachedRecordsMap = JSON.parse(raw) as Record<string, QrCodeRow>;
    return cachedRecordsMap;
  } catch {
    return cachedRecordsMap;
  }
}

export function saveLocalQrRecord(record: QrCodeRow): void {
  if (typeof window === "undefined") return;
  try {
    const existing = { ...readLocalRecords() };
    existing[record.short_code] = record;
    existing[record.id] = record;
    const serialized = JSON.stringify(existing);
    cachedRecordsRaw = serialized;
    cachedRecordsMap = existing;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
  } catch {
    // Ignore storage quota or privacy-mode errors.
  }
}

export function getLocalQrRecord(idOrShortCode: string): QrCodeRow | null {
  const records = readLocalRecords();
  return records[idOrShortCode] ?? null;
}

let cachedStepsRaw: string | null = null;
let cachedStepsMap: Record<string, SopStepRow[]> = {};
const EMPTY_STEPS: SopStepRow[] = [];

function readLocalStepsMap(): Record<string, SopStepRow[]> {
  if (typeof window === "undefined") return cachedStepsMap;
  try {
    const raw = window.localStorage.getItem(LOCAL_STEPS_STORAGE_KEY);
    if (!raw) {
      cachedStepsRaw = null;
      cachedStepsMap = {};
      return cachedStepsMap;
    }
    if (raw === cachedStepsRaw) {
      return cachedStepsMap;
    }
    cachedStepsRaw = raw;
    cachedStepsMap = JSON.parse(raw) as Record<string, SopStepRow[]>;
    return cachedStepsMap;
  } catch {
    return cachedStepsMap;
  }
}

export function saveLocalSopSteps(
  keys: string[],
  steps: SopStepRow[],
): void {
  if (typeof window === "undefined") return;
  try {
    const existing = { ...readLocalStepsMap() };
    for (const key of keys) {
      if (key) existing[key] = steps;
    }
    const serialized = JSON.stringify(existing);
    cachedStepsRaw = serialized;
    cachedStepsMap = existing;
    window.localStorage.setItem(LOCAL_STEPS_STORAGE_KEY, serialized);
  } catch {
    // Ignore storage quota or privacy-mode errors.
  }
}

export function getLocalSopSteps(idOrShortCode: string): SopStepRow[] {
  const map = readLocalStepsMap();
  return map[idOrShortCode] ?? EMPTY_STEPS;
}

export interface LocalInspectionLogEntry extends InspectionLogInsert {
  id: string;
  created_at: string;
}

export function saveLocalInspectionLog(
  entry: InspectionLogInsert,
): LocalInspectionLogEntry {
  const saved: LocalInspectionLogEntry = {
    ...entry,
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `log-${Date.now()}`,
    created_at: entry.created_at ?? new Date().toISOString(),
  };
  if (typeof window === "undefined") return saved;
  try {
    const raw = window.localStorage.getItem(LOCAL_LOGS_STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as LocalInspectionLogEntry[]) : [];
    existing.unshift(saved);
    window.localStorage.setItem(
      LOCAL_LOGS_STORAGE_KEY,
      JSON.stringify(existing.slice(0, 100)),
    );
  } catch {
    // Ignore storage quota or privacy-mode errors.
  }
  return saved;
}

export interface CreateGuestSopStepInput {
  stepOrder: number;
  title: string;
  instruction: string;
  isCritical?: boolean;
}

export interface CreateGuestQrInput {
  title: string;
  description: string;
  category: string;
  type?: string;
  configJson?: Json;
  steps?: CreateGuestSopStepInput[];
}

export interface CreateGuestQrResult {
  record: QrCodeRow | null;
  isLocalFallback: boolean;
  blockedByPlanLimit?: boolean;
  notice?: string;
}

function toLocalSopSteps(
  qrCodeId: string,
  steps: CreateGuestSopStepInput[],
  createdAt: string,
): SopStepRow[] {
  return steps.map((step) => ({
    id: `${qrCodeId}-step-${step.stepOrder}`,
    qr_code_id: qrCodeId,
    step_order: step.stepOrder,
    title: step.title,
    instruction: step.instruction,
    is_critical: Boolean(step.isCritical),
    timestamp_sec: null,
    translations_json: {},
    created_at: createdAt,
  }));
}

/**
 * Inserts a QR record into Supabase. Links `user_id` when authenticated and enforces
 * Free-tier limits (10 QRs max, watermark locked ON). Unlocks watermark removal only
 * on active Pro / Business plans.
 * Falls back to a local record if Supabase env vars are not configured or unreachable.
 */
export async function createGuestQrCode(
  input: CreateGuestQrInput,
): Promise<CreateGuestQrResult> {
  const shortCode = generateShortCode(8);
  const now = new Date().toISOString();
  const title = input.title.trim() || "Untitled Operations QR";
  const description = input.description.trim() || null;
  const category = input.category || "general";
  const type = input.type || "standard";
  const configJson = input.configJson ?? {};
  const steps = input.steps ?? [];

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
    type,
    config_json: configJson,
    show_watermark: true,
    scan_count: 0,
    last_scanned_at: null,
    current_status: "ok",
    last_inspected_at: null,
    created_at: now,
    updated_at: now,
  };

  if (!hasSupabaseEnv()) {
    saveLocalQrRecord(localFallbackRecord);
    if (steps.length > 0) {
      saveLocalSopSteps(
        [shortCode, localFallbackRecord.id],
        toLocalSopSteps(localFallbackRecord.id, steps, now),
      );
    }
    return {
      record: localFallbackRecord,
      isLocalFallback: true,
      notice:
        "Supabase env vars not configured locally — running in local preview mode.",
    };
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id ?? null;

    let showWatermark = true;
    if (userId) {
      let effectivePlan = resolveEffectivePlan("free", null);
      const { data: planRow } = await supabase
        .from("user_plans")
        .select("plan, plan_expires_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (planRow) {
        effectivePlan = resolveEffectivePlan(
          planRow.plan,
          planRow.plan_expires_at,
        );
      }

      const paid = isPaidPlan(effectivePlan);
      showWatermark = !paid;

      if (!paid) {
        const { count, error: countError } = await supabase
          .from("qr_codes")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId);

        if (!countError && (count ?? 0) >= FREE_QR_LIMIT) {
          return {
            record: null,
            isLocalFallback: false,
            blockedByPlanLimit: true,
            notice: `Free plan limit reached (${FREE_QR_LIMIT}/${FREE_QR_LIMIT} QR codes). Upgrade to Pro for unlimited QR codes.`,
          };
        }
      }
    }

    const { data, error } = await supabase
      .from("qr_codes")
      .insert({
        short_code: shortCode,
        user_id: userId,
        title,
        description,
        category,
        type,
        config_json: configJson,
        show_watermark: showWatermark,
      })
      .select()
      .single();

    if (error || !data) {
      if (
        userId &&
        error?.message?.toLowerCase().includes("row-level security")
      ) {
        return {
          record: null,
          isLocalFallback: false,
          blockedByPlanLimit: true,
          notice: `Free plan limit reached (${FREE_QR_LIMIT}/${FREE_QR_LIMIT} QR codes). Upgrade to Pro for unlimited QR codes.`,
        };
      }
      saveLocalQrRecord(localFallbackRecord);
      if (steps.length > 0) {
        saveLocalSopSteps(
          [shortCode, localFallbackRecord.id],
          toLocalSopSteps(localFallbackRecord.id, steps, now),
        );
      }
      return {
        record: localFallbackRecord,
        isLocalFallback: true,
        notice:
          error?.message ||
          "Could not reach Supabase — saved to local preview state.",
      };
    }

    saveLocalQrRecord(data);

    if (steps.length > 0) {
      const stepRows = steps.map((step) => ({
        qr_code_id: data.id,
        step_order: step.stepOrder,
        title: step.title,
        instruction: step.instruction,
        is_critical: Boolean(step.isCritical),
      }));

      const { data: insertedSteps, error: stepsError } = await supabase
        .from("sop_steps")
        .insert(stepRows)
        .select();

      if (!stepsError && insertedSteps) {
        saveLocalSopSteps([data.short_code, data.id], insertedSteps);
      } else {
        saveLocalSopSteps(
          [data.short_code, data.id],
          toLocalSopSteps(data.id, steps, now),
        );
      }
    }

    return {
      record: data,
      isLocalFallback: false,
    };
  } catch {
    saveLocalQrRecord(localFallbackRecord);
    if (steps.length > 0) {
      saveLocalSopSteps(
        [shortCode, localFallbackRecord.id],
        toLocalSopSteps(localFallbackRecord.id, steps, now),
      );
    }
    return {
      record: localFallbackRecord,
      isLocalFallback: true,
      notice: "Supabase unavailable — saved to local preview state.",
    };
  }
}

/** Returns a safe fallback demo record when `/studio/demo` or `/q/demo` is opened. */
export function getDemoQrRecord(idOrCode: string): QrCodeRow {
  const preset =
    TEMPLATE_PRESETS.find((t) => t.id === idOrCode) ?? TEMPLATE_PRESETS[0];
  const now = new Date().toISOString();
  const isDemo = idOrCode === "demo";

  return {
    id: "00000000-0000-4000-8000-000000000001",
    short_code: isDemo ? "demo" : idOrCode.slice(0, 12),
    user_id: null,
    title: isDemo ? "D2C Packing Station #04" : preset.title,
    description: preset.description,
    category: preset.category,
    type: isDemo ? "video_sop" : "standard",
    config_json: isDemo
      ? ({
          summary:
            "Standard dispatch packing & tamper-seal verification for fragile D2C orders.",
          languages: ["English", "Hindi", "Hinglish", "Telugu", "Tamil"],
          checklist: [
            { label: "Bubble wrap covers all 4 corners", required: true },
            { label: "Invoice & return slip placed inside box", required: true },
            { label: "Tamper-evident tape sealed flush", required: true },
            { label: "Shipping label barcode scanned cleanly", required: false },
          ],
        } as unknown as Json)
      : {},
    show_watermark: true,
    scan_count: 0,
    last_scanned_at: null,
    current_status: "ok",
    last_inspected_at: null,
    created_at: now,
    updated_at: now,
  };
}

/** Returns demo SOP steps for `/q/demo` when no database or localStorage record exists. */
export function getDemoSopSteps(): SopStepRow[] {
  const now = new Date().toISOString();
  const qrId = "00000000-0000-4000-8000-000000000001";
  return [
    {
      id: "demo-step-1",
      qr_code_id: qrId,
      step_order: 1,
      title: "Inspect outer carton & fold bottom flaps",
      instruction:
        "Check corrugated box for moisture or crushed corners. Tape the bottom seam with H-pattern 48mm tape.",
      is_critical: false,
      timestamp_sec: 4,
      translations_json: {
        English: {
          title: "Inspect outer carton & fold bottom flaps",
          description:
            "Check corrugated box for moisture or crushed corners. Tape the bottom seam with H-pattern 48mm tape.",
        },
        Hindi: {
          title: "बाहरी कार्टन जांचें और निचले फ्लैप मोड़ें",
          description:
            "नमी या मुड़े हुए कोनों के लिए बॉक्स जांचें। नीचे की सिलाई को 48mm टेप से H-पैटर्न में सील करें।",
        },
        Hinglish: {
          title: "Outer carton check karein aur bottom flaps fold karein",
          description:
            "Box mein moisture ya damaged corners check karein. Bottom seam ko 48mm tape se H-pattern mein seal karein.",
        },
        Telugu: {
          title: "బాక్స్‌ను తనిఖీ చేసి అడుగు భాగాన్ని మడవండి",
          description:
            "తేమ లేదా నలిగిన మూలలు లేవని నిర్ధారించుకోండి. అడుగు భాగాన్ని 48mm టేప్‌తో H-ప్యాటర్న్‌లో సీల్ చేయండి.",
        },
        Tamil: {
          title: "பெட்டியைப் பரிசோதித்து அடிப்பகுதியை மடிக்கவும்",
          description:
            "ஈரம் அல்லது நசுங்கிய மூலைகள் உள்ளதா எனப் பார்க்கவும். அடிப்பகுதியை 48mm டேப்பால் H-முறையில் சீல் செய்யவும்.",
        },
      } as unknown as Json,
      created_at: now,
    },
    {
      id: "demo-step-2",
      qr_code_id: qrId,
      step_order: 2,
      title: "Wrap fragile unit & add void fill",
      instruction:
        "Wrap glass or liquid SKU in 2 layers of bubble wrap. Ensure zero rattle when box is gently shaken.",
      is_critical: true,
      timestamp_sec: 18,
      translations_json: {
        English: {
          title: "Wrap fragile unit & add void fill",
          description:
            "Wrap glass or liquid SKU in 2 layers of bubble wrap. Ensure zero rattle when box is gently shaken.",
        },
        Hindi: {
          title: "नाजुक आइटम को बबल रैप में लपेटें",
          description:
            "कांच या लिक्विड आइटम को बबल रैप की 2 परतों में लपेटें। हिलाने पर अंदर से आवाज़ नहीं आनी चाहिए।",
        },
        Hinglish: {
          title: "Fragile item ko bubble wrap karein aur void fill daalein",
          description:
            "Glass ya liquid SKU ko 2 layer bubble wrap mein pack karein. Box hilane par bilkul rattle nahi hona chahiye.",
        },
        Telugu: {
          title: "సున్నితమైన వస్తువును బబుల్ ర్యాప్‌లో చుట్టండి",
          description:
            "గ్లాస్ లేదా లిక్విడ్ వస్తువును 2 పొరల బబుల్ ర్యాప్‌లో చుట్టండి. బాక్స్ కదిలించినప్పుడు శబ్దం రాకూడదు.",
        },
        Tamil: {
          title: "உடையக்கூடிய பொருளை பபுள் ராப்பில் சுற்றவும்",
          description:
            "கண்ணாடி அல்லது திரவப் பொருளை 2 அடுக்கு பபுள் ராப்பில் சுற்றவும். பெட்டியை அசைக்கும்போது சத்தம் வரக்கூடாது.",
        },
      } as unknown as Json,
      created_at: now,
    },
    {
      id: "demo-step-3",
      qr_code_id: qrId,
      step_order: 3,
      title: "Insert invoice & apply tamper-evident seal",
      instruction:
        "Place printed invoice on top, seal top flaps, and paste shipping label flat without covering the barcode.",
      is_critical: false,
      timestamp_sec: 36,
      translations_json: {
        English: {
          title: "Insert invoice & apply tamper-evident seal",
          description:
            "Place printed invoice on top, seal top flaps, and paste shipping label flat without covering the barcode.",
        },
        Hindi: {
          title: "इनवॉइस रखें और टैम्पर-प्रूफ सील लगाएं",
          description:
            "प्रिंटेड इनवॉइस ऊपर रखें, फ्लैप सील करें, और बारकोड को मोड़े बिना शिपिंग लेबल चिपकाएं।",
        },
        Hinglish: {
          title: "Invoice andar rakhein aur tamper-evident seal lagayein",
          description:
            "Printed invoice upar rakhein, top flaps seal karein, aur shipping label barcode fold kiye bina flat chipkayein.",
        },
        Telugu: {
          title: "ఇన్‌వాయిస్ ఉంచి ట్యాంపర్-ప్రూఫ్ సీల్ వేయండి",
          description:
            "ప్రింటెడ్ ఇన్‌వాయిస్ పైన ఉంచి, ఫ్లాప్స్ సీల్ చేసి, బార్‌కోడ్ మడతపడకుండా షిప్పింగ్ లేబుల్ అంటించండి.",
        },
        Tamil: {
          title: "இன்வாய்ஸ் வைத்து டேம்பர்-ப்ரூஃப் சீல் ஒட்டவும்",
          description:
            "அச்சிடப்பட்ட இன்வாய்ஸை மேலே வைத்து, பெட்டியை சீல் செய்து, பார்கோடு மடியாமல் ஷிப்பிங் லேபிளை ஒட்டவும்.",
        },
      } as unknown as Json,
      created_at: now,
    },
  ];
}
