import { GoogleGenAI } from "@google/genai";
import { generateShortCode } from "@/lib/qr-utils";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import type { VideoSopStep } from "@/types/ai";

export const DEFAULT_AI_LANGUAGES = [
  "English",
  "Hindi",
  "Hinglish",
  "Telugu",
  "Tamil",
] as const;

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

/**
 * Initializes the official Google GenAI SDK strictly on the server.
 */
export function getGeminiClient(): GoogleGenAI {
  if (typeof window !== "undefined") {
    throw new Error("getGeminiClient must only be called on the server.");
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to .env.local to enable AI extraction.",
    );
  }

  return new GoogleGenAI({ apiKey });
}

/**
 * Parses `languages` from multipart/form-data (JSON array, comma-separated, or repeated fields).
 */
export function parseLanguagesField(entries: FormDataEntryValue[]): string[] {
  const collected: string[] = [];

  for (const entry of entries) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("[")) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (typeof item === "string" && item.trim()) {
              collected.push(item.trim());
            }
          }
          continue;
        }
      } catch {
        // Fall through to comma-split if invalid JSON.
      }
    }

    for (const part of trimmed.split(",")) {
      const clean = part.trim();
      if (clean) collected.push(clean);
    }
  }

  const unique = Array.from(new Set(collected));
  return unique.length > 0 ? unique : [...DEFAULT_AI_LANGUAGES];
}

/**
 * Parses JSON text returned by Gemini, stripping accidental markdown fences if present.
 */
export function parseGeminiJson(rawText: string | undefined): unknown {
  if (!rawText || !rawText.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned) as unknown;
}

export interface PersistAiQrInput {
  type: "video_sop" | "paper_form";
  category: string;
  title: string;
  description: string | null;
  configJson: Json;
  steps?: VideoSopStep[];
}

export interface PersistAiQrResult {
  id: string;
  short_code: string;
  isLocalFallback: boolean;
  notice?: string;
}

/**
 * Persists an AI-generated QR code (and optional SOP steps) to Supabase.
 * Attaches `user_id` when the caller is authenticated, or saves as an
 * anonymous guest record (`user_id: null`, `show_watermark: true`), falling
 * back cleanly when Supabase env vars are missing or unreachable.
 */
export async function persistAiQrRecord(
  input: PersistAiQrInput,
): Promise<PersistAiQrResult> {
  const shortCode = generateShortCode(8);
  const fallbackId = crypto.randomUUID();

  if (!hasSupabaseEnv()) {
    return {
      id: fallbackId,
      short_code: shortCode,
      isLocalFallback: true,
      notice:
        "Supabase env vars not configured locally — generated AI output in local preview mode.",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id ?? null;

    const { data: qrRow, error: qrError } = await supabase
      .from("qr_codes")
      .insert({
        short_code: shortCode,
        user_id: userId,
        title: input.title,
        description: input.description,
        category: input.category,
        type: input.type,
        config_json: input.configJson,
        show_watermark: !userId,
      })
      .select("id, short_code")
      .single();

    if (qrError || !qrRow) {
      return {
        id: fallbackId,
        short_code: shortCode,
        isLocalFallback: true,
        notice:
          qrError?.message ||
          "Could not save to Supabase — returned AI output in local preview mode.",
      };
    }

    if (input.steps && input.steps.length > 0) {
      const stepRows = input.steps.map((step) => ({
        qr_code_id: qrRow.id,
        step_order: step.step_number,
        title: step.title,
        instruction: step.description,
        is_critical: false,
        timestamp_sec: step.timestamp_sec,
        translations_json: step.translations_json as unknown as Json,
      }));

      const { error: stepsError } = await supabase
        .from("sop_steps")
        .insert(stepRows);

      if (stepsError) {
        return {
          id: qrRow.id,
          short_code: qrRow.short_code,
          isLocalFallback: true,
          notice: `QR saved, but SOP steps insert failed: ${stepsError.message}`,
        };
      }
    }

    return {
      id: qrRow.id,
      short_code: qrRow.short_code,
      isLocalFallback: false,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Supabase request failed";
    return {
      id: fallbackId,
      short_code: shortCode,
      isLocalFallback: true,
      notice: `${message} — returned AI output in local preview mode.`,
    };
  }
}
