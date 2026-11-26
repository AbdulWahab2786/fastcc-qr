import type { Database, InspectionStatus } from "./database";

export type QrCodeRow = Database["public"]["Tables"]["qr_codes"]["Row"];
export type QrCodeInsert = Database["public"]["Tables"]["qr_codes"]["Insert"];
export type QrCodeUpdate = Database["public"]["Tables"]["qr_codes"]["Update"];

export type SopStepRow = Database["public"]["Tables"]["sop_steps"]["Row"];
export type SopStepInsert = Database["public"]["Tables"]["sop_steps"]["Insert"];
export type SopStepUpdate = Database["public"]["Tables"]["sop_steps"]["Update"];

export type InspectionLogRow =
  Database["public"]["Tables"]["inspection_logs"]["Row"];
export type InspectionLogInsert =
  Database["public"]["Tables"]["inspection_logs"]["Insert"];

export interface StepResult {
  step_id: string;
  passed: boolean;
  note?: string;
}

export interface QrCodeWithSteps extends QrCodeRow {
  sop_steps: SopStepRow[];
}

export type { InspectionStatus };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Returns true when a route identifier is formatted as a UUID rather than a short_code. */
export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}
