import { NextResponse } from "next/server";
import { Type, type Schema } from "@google/genai";
import {
  enforceAiRequestGuard,
  GEMINI_MODEL,
  getGeminiClient,
  parseGeminiJson,
  parseLanguagesField,
  persistAiQrRecord,
  requireAuthenticatedUser,
} from "@/lib/ai/gemini";
import { isPaidPlan } from "@/lib/billing/constants";
import { incrementUserAiSopsUsed } from "@/lib/billing/plans";
import type { Json } from "@/types/database";
import type {
  PaperFormApiResponse,
  PaperFormField,
  PaperFormFieldType,
} from "@/types/ai";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

const PAPER_FORM_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    fields: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          type: {
            type: Type.STRING,
            enum: ["pass_fail", "text", "number", "photo"],
          },
          required: { type: Type.BOOLEAN },
          translations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                language: { type: Type.STRING },
                label: { type: Type.STRING },
              },
              required: ["language", "label"],
            },
          },
        },
        required: ["id", "label", "type", "required", "translations"],
      },
    },
  },
  required: ["title", "fields"],
};

interface RawGeminiPaperForm {
  title?: unknown;
  fields?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeFieldType(value: unknown): PaperFormFieldType {
  if (
    value === "pass_fail" ||
    value === "text" ||
    value === "number" ||
    value === "photo"
  ) {
    return value;
  }
  return "pass_fail";
}

function normalizePaperFormOutput(parsed: unknown): {
  title: string;
  fields: PaperFormField[];
} {
  const data: RawGeminiPaperForm = isRecord(parsed) ? parsed : {};
  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title.trim()
      : "Digitized Inspection Checklist";

  const rawFields = Array.isArray(data.fields) ? data.fields : [];
  const fields: PaperFormField[] = rawFields
    .filter(isRecord)
    .map((item, idx) => {
      const id =
        typeof item.id === "string" && item.id.trim()
          ? item.id.trim()
          : `field_${idx + 1}`;
      const label =
        typeof item.label === "string" && item.label.trim()
          ? item.label.trim()
          : `Check Item ${idx + 1}`;

      const translations: Record<string, string> = {};
      if (Array.isArray(item.translations)) {
        for (const tr of item.translations) {
          if (!isRecord(tr)) continue;
          const lang =
            typeof tr.language === "string" ? tr.language.trim() : "";
          const trLabel = typeof tr.label === "string" ? tr.label.trim() : "";
          if (lang && trLabel) {
            translations[lang] = trLabel;
          }
        }
      }

      return {
        id,
        label,
        type: normalizeFieldType(item.type),
        required: typeof item.required === "boolean" ? item.required : true,
        translations,
      };
    });

  return { title, fields };
}

export async function POST(request: Request) {
  const user = await requireAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      {
        error:
          "Sign in for free to generate AI SOPs and save them to your dashboard.",
      },
      { status: 401 },
    );
  }

  const guard = await enforceAiRequestGuard(user.id);
  if (!guard.allowed) {
    return NextResponse.json(
      {
        error: guard.error,
        code: guard.code,
        upgradeRequired: Boolean(guard.upgradeRequired),
      },
      {
        status: guard.status,
        headers: guard.retryAfterSec
          ? { "Retry-After": String(guard.retryAfterSec) }
          : undefined,
      },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data payload." },
      { status: 400 },
    );
  }

  const fileEntry = formData.get("image") ?? formData.get("file");
  if (!(fileEntry instanceof File)) {
    return NextResponse.json(
      { error: "Missing image file in form data." },
      { status: 400 },
    );
  }

  if (fileEntry.size === 0) {
    return NextResponse.json(
      { error: "Uploaded image file is empty." },
      { status: 400 },
    );
  }

  if (fileEntry.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image file exceeds the 15MB upload limit." },
      { status: 413 },
    );
  }

  if (fileEntry.type && !fileEntry.type.startsWith("image/")) {
    return NextResponse.json(
      { error: `Unsupported file type "${fileEntry.type}". Upload an image file.` },
      { status: 400 },
    );
  }

  const languages = parseLanguagesField(formData.getAll("languages"));

  let ai: ReturnType<typeof getGeminiClient>;
  try {
    ai = getGeminiClient();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gemini client unavailable.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  try {
    const arrayBuffer = await fileEntry.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = fileEntry.type || "image/jpeg";

    const prompt = [
      "You are digitizing a photo of a paper logbook, checklist, or inspection register into a structured mobile frontline form.",
      `Target worker languages for translations: ${languages.join(", ")}.`,
      "Extract the form `title` and every check item or field into `fields`.",
      "For each field:",
      "- `id`: concise snake_case identifier",
      "- `label`: clear field label",
      "- `type`: one of 'pass_fail', 'text', 'number', 'photo'",
      "- `required`: boolean",
      "- `translations`: array of { language, label } for EVERY requested language.",
    ].join("\n");

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType,
          },
        },
        prompt,
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: PAPER_FORM_SCHEMA,
      },
    });

    const parsed = parseGeminiJson(response.text);
    const normalized = normalizePaperFormOutput(parsed);

    const configJson = {
      fields: normalized.fields,
      languages,
    } as unknown as Json;

    const persisted = await persistAiQrRecord({
      type: "paper_form",
      category: "checklist",
      title: normalized.title,
      description: `Digitized mobile inspection form (${normalized.fields.length} fields).`,
      configJson,
      showWatermark: !isPaidPlan(guard.planStatus.effectivePlan),
    });

    await incrementUserAiSopsUsed(guard.supabase, user.id);

    const payload: PaperFormApiResponse = {
      short_code: persisted.short_code,
      id: persisted.id,
      title: normalized.title,
      fields: normalized.fields,
      show_watermark: persisted.show_watermark,
      isLocalFallback: persisted.isLocalFallback,
      notice: persisted.notice,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to digitize paper checklist.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
