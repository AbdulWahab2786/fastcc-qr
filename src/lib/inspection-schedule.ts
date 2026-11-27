import type { Json } from "@/types/database";
import type { QrCodeRow } from "@/types/qr";

export type InspectionSchedule = "none" | "daily" | "weekly" | "monthly";

export interface InspectionScheduleOption {
  value: InspectionSchedule;
  label: string;
  shortLabel: string;
}

export const INSPECTION_SCHEDULE_OPTIONS: readonly InspectionScheduleOption[] = [
  { value: "none", label: "None", shortLabel: "None" },
  { value: "daily", label: "Daily (Every 24h)", shortLabel: "Daily" },
  { value: "weekly", label: "Weekly (Every 7d)", shortLabel: "Weekly" },
  { value: "monthly", label: "Monthly (Every 30d)", shortLabel: "Monthly" },
];

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const MINUTE_MS = 60 * 1000;

const SCHEDULE_THRESHOLDS_MS: Record<
  Exclude<InspectionSchedule, "none">,
  number
> = {
  daily: DAY_MS,
  weekly: 7 * DAY_MS,
  monthly: 30 * DAY_MS,
};

const SCHEDULE_SHORT_LABELS: Record<InspectionSchedule, string> = {
  none: "None",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export interface ScheduleStatus {
  schedule: InspectionSchedule;
  isOverdue: boolean;
  label: string;
  scheduleLabel: string;
}

function isJsonObject(
  value: Json | unknown,
): value is Record<string, Json | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Normalizes any unknown input to a valid `InspectionSchedule` value. */
export function normalizeInspectionSchedule(value: unknown): InspectionSchedule {
  if (
    value === "daily" ||
    value === "weekly" ||
    value === "monthly" ||
    value === "none"
  ) {
    return value;
  }
  return "none";
}

/** Safely reads `config_json.inspection_schedule`, defaulting to `'none'`. */
export function getQrSchedule(
  qr: Pick<QrCodeRow, "config_json">,
): InspectionSchedule {
  if (!isJsonObject(qr.config_json)) return "none";
  return normalizeInspectionSchedule(qr.config_json.inspection_schedule);
}

function formatOverdueDuration(overdueMs: number): string {
  if (overdueMs >= DAY_MS) {
    const days = Math.max(1, Math.floor(overdueMs / DAY_MS));
    return `Overdue by ${days}d`;
  }
  if (overdueMs >= HOUR_MS) {
    const hours = Math.max(1, Math.floor(overdueMs / HOUR_MS));
    return `Overdue by ${hours}h`;
  }
  const minutes = Math.max(1, Math.floor(overdueMs / MINUTE_MS));
  return `Overdue by ${minutes}m`;
}

function formatRemainingDuration(remainingMs: number): string {
  if (remainingMs >= DAY_MS) {
    return "On track";
  }
  if (remainingMs >= HOUR_MS) {
    const hours = Math.max(1, Math.ceil(remainingMs / HOUR_MS));
    return `Due in ${hours}h`;
  }
  if (remainingMs > 0) {
    const minutes = Math.max(1, Math.ceil(remainingMs / MINUTE_MS));
    return `Due in ${minutes}m`;
  }
  return "Due now";
}

/**
 * Evaluates whether an asset's inspection schedule is overdue relative to
 * `last_inspected_at` (falling back to `created_at` when never inspected).
 */
export function getScheduleStatus(
  qr: Pick<QrCodeRow, "config_json" | "last_inspected_at" | "created_at">,
  nowMs = Date.now(),
): ScheduleStatus {
  const schedule = getQrSchedule(qr);
  const scheduleLabel = SCHEDULE_SHORT_LABELS[schedule];

  if (schedule === "none") {
    return {
      schedule: "none",
      isOverdue: false,
      label: "No schedule",
      scheduleLabel,
    };
  }

  const thresholdMs = SCHEDULE_THRESHOLDS_MS[schedule];
  const lastInspectedMs = qr.last_inspected_at
    ? Date.parse(qr.last_inspected_at)
    : Number.NaN;
  const createdMs = Date.parse(qr.created_at);
  const baseMs = Number.isFinite(lastInspectedMs)
    ? lastInspectedMs
    : Number.isFinite(createdMs)
      ? createdMs
      : nowMs;

  const elapsedMs = nowMs - baseMs;
  const isOverdue = elapsedMs > thresholdMs;

  return {
    schedule,
    isOverdue,
    label: isOverdue
      ? formatOverdueDuration(elapsedMs - thresholdMs)
      : formatRemainingDuration(thresholdMs - elapsedMs),
    scheduleLabel,
  };
}
