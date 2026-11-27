import { NextResponse } from "next/server";
import { Type, type Schema } from "@google/genai";
import { GEMINI_MODEL, getGeminiClient, parseGeminiJson } from "@/lib/ai/gemini";

type TargetRegionalLang = "hi" | "te" | "mr" | "ta";

const LANGUAGE_NAMES: Record<TargetRegionalLang, string> = {
  hi: "Hindi (simple, natural shop-floor Hindi in Devanagari script)",
  te: "Telugu (simple, natural shop-floor Telugu in Telugu script)",
  mr: "Marathi (simple, natural shop-floor Marathi in Devanagari script)",
  ta: "Tamil (simple, natural shop-floor Tamil in Tamil script)",
};

const MAX_ITEMS = 40;
const MAX_TEXT_LENGTH = 600;

const TRANSLATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    items: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["title", "items"],
};

function isTargetRegionalLang(value: unknown): value is TargetRegionalLang {
  return value === "hi" || value === "te" || value === "mr" || value === "ta";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const targetLang = body.targetLang;
  if (!isTargetRegionalLang(targetLang)) {
    return NextResponse.json(
      { error: "Unsupported targetLang. Expected 'hi', 'te', 'mr', or 'ta'." },
      { status: 400 },
    );
  }

  const rawTitle = typeof body.title === "string" ? body.title.trim() : "";
  const title = rawTitle.slice(0, MAX_TEXT_LENGTH);

  if (!Array.isArray(body.items)) {
    return NextResponse.json(
      { error: "Expected items to be an array of strings." },
      { status: 400 },
    );
  }

  if (body.items.length > MAX_ITEMS) {
    return NextResponse.json(
      { error: `Too many items to translate (max ${MAX_ITEMS}).` },
      { status: 400 },
    );
  }

  const items: string[] = body.items.map((item) =>
    typeof item === "string" ? item.trim().slice(0, MAX_TEXT_LENGTH) : "",
  );

  if (!title && items.every((item) => item.length === 0)) {
    return NextResponse.json({ title, items });
  }

  let ai: ReturnType<typeof getGeminiClient>;
  try {
    ai = getGeminiClient();
  } catch {
    // Graceful fallback: keep English without breaking the worker's workflow.
    return NextResponse.json({ title, items, fallback: true });
  }

  try {
    const prompt = [
      `Translate the following factory / shop-floor SOP title and items into ${LANGUAGE_NAMES[targetLang]}.`,
      "Rules:",
      "- Use clear, practical, everyday shop-floor language that frontline workers understand immediately.",
      "- Keep technical model numbers, units (mm, °C, PSI, V, A), and equipment codes intact.",
      `- Return the exact same number of strings in \`items\` (${items.length}) in the exact same order.`,
      "- If an item is empty string, keep it empty string.",
      "",
      JSON.stringify({ title, items }),
    ].join("\n");

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [prompt],
      config: {
        responseMimeType: "application/json",
        responseSchema: TRANSLATION_SCHEMA,
      },
    });

    const parsed = parseGeminiJson(response.text);
    const data = isRecord(parsed) ? parsed : {};

    const translatedTitle =
      typeof data.title === "string" && data.title.trim()
        ? data.title.trim()
        : title;

    const rawTranslatedItems = Array.isArray(data.items) ? data.items : [];
    const translatedItems = items.map((original, idx) => {
      const candidate = rawTranslatedItems[idx];
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
      return original;
    });

    return NextResponse.json({
      title: translatedTitle,
      items: translatedItems,
    });
  } catch {
    // Graceful fallback: silently stay in English if Gemini errors out.
    return NextResponse.json({ title, items, fallback: true });
  }
}
