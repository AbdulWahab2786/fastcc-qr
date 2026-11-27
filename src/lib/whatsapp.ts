import type { EquipmentStatus } from "@/types/database";

/**
 * Normalizes a WhatsApp phone number to digits-only international format for `wa.me/<number>`.
 * Prepends India country code `91` when a 10-digit local mobile number (or 11-digit `0...`) is given.
 */
export function sanitizeWhatsAppNumber(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.length === 11 && digits.startsWith("0")) {
    digits = `91${digits.slice(1)}`;
  } else if (digits.length === 10) {
    digits = `91${digits}`;
  }

  if (digits.length < 7) return null;
  return digits;
}

export interface WhatsAppAlertParams {
  managerWhatsapp?: string | null;
  equipmentStatus: Extract<EquipmentStatus, "faulty" | "maintenance">;
  machineTitle: string;
  workerName: string;
  timestampIso: string;
  notes?: string | null;
  photoUrl?: string | null;
  viewLogUrl: string;
}

/**
 * Builds a zero-cost `https://wa.me/` deep link pre-filled with a formatted FastCC QR alert.
 */
export function buildFaultyWhatsAppAlertUrl(
  params: WhatsAppAlertParams,
): string {
  const statusLabel =
    params.equipmentStatus === "faulty" ? "FAULTY" : "NEEDS MAINTENANCE";

  const parsedDate = new Date(params.timestampIso);
  const localTimestamp = Number.isNaN(parsedDate.getTime())
    ? params.timestampIso
    : parsedDate.toLocaleString();

  const notesText = params.notes?.trim() || "No notes";

  const lines = [
    `🚨 *FASTCC QR ALERT: ${statusLabel}*`,
    `Machine: ${params.machineTitle}`,
    `Reported by: ${params.workerName}`,
    `Time: ${localTimestamp}`,
    `Notes: ${notesText}`,
  ];

  if (params.photoUrl?.trim()) {
    lines.push(`Photo Proof: ${params.photoUrl.trim()}`);
  }

  lines.push(`View Log: ${params.viewLogUrl}`);

  const encodedMessage = encodeURIComponent(lines.join("\n"));
  const sanitizedNumber = sanitizeWhatsAppNumber(params.managerWhatsapp);

  return sanitizedNumber
    ? `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;
}
