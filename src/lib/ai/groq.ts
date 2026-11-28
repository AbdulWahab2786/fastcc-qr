export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export interface GroqImageInput {
  base64Data: string;
  mimeType: string;
}

export interface GroqVisionRequest {
  prompt: string;
  images: GroqImageInput[];
  temperature?: number;
  maxTokens?: number;
}

interface GroqChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

/**
 * Returns the configured Groq API key on the server, or null if not set.
 */
export function getGroqApiKey(): string | null {
  if (typeof window !== "undefined") {
    throw new Error("getGroqApiKey must only be called on the server.");
  }

  const apiKey = process.env.GROQ_API_KEY?.trim();
  return apiKey ? apiKey : null;
}

/**
 * Parses JSON text returned by an AI model, stripping accidental markdown fences.
 */
export function parseAiJson(rawText: string | undefined | null): unknown {
  if (!rawText || !rawText.trim()) {
    throw new Error("AI model returned an empty response.");
  }

  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as unknown;
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as unknown;
    }
    throw new Error("AI model returned invalid JSON.");
  }
}

/**
 * Calls Groq's OpenAI-compatible Chat Completions endpoint with vision inputs
 * and returns the parsed JSON object.
 */
export async function generateGroqVisionJson(
  request: GroqVisionRequest,
): Promise<unknown> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured. Add it to .env.local to enable Groq Vision.",
    );
  }

  if (request.images.length === 0) {
    throw new Error("At least one image is required for Groq Vision.");
  }

  const content: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  > = [
    { type: "text", text: request.prompt },
    ...request.images.map((img) => ({
      type: "image_url" as const,
      image_url: {
        url: `data:${img.mimeType || "image/jpeg"};base64,${img.base64Data}`,
      },
    })),
  ];

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_VISION_MODEL,
      messages: [
        {
          role: "user",
          content,
        },
      ],
      response_format: { type: "json_object" },
      temperature: request.temperature ?? 0.2,
      max_tokens: request.maxTokens ?? 4096,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | GroqChatCompletionResponse
    | null;

  if (!response.ok) {
    const errMsg =
      payload?.error?.message ||
      `Groq Vision request failed with status ${response.status}.`;
    throw new Error(errMsg);
  }

  const rawContent = payload?.choices?.[0]?.message?.content;
  return parseAiJson(rawContent);
}
