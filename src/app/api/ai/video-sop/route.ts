import { NextResponse } from "next/server";
import { createPartFromUri, FileState, Type, type Schema } from "@google/genai";
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
  StepTranslation,
  VideoSopApiResponse,
  VideoSopChecklistItem,
  VideoSopStep,
} from "@/types/ai";

const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
const FILE_POLL_INTERVAL_MS = 2000;
const FILE_POLL_MAX_ATTEMPTS = 30;

const VIDEO_SOP_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step_number: { type: Type.INTEGER },
          timestamp_sec: { type: Type.INTEGER },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          translations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                language: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["language", "title", "description"],
            },
          },
        },
        required: [
          "step_number",
          "timestamp_sec",
          "title",
          "description",
          "translations",
        ],
      },
    },
    checklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          required: { type: Type.BOOLEAN },
        },
        required: ["label", "required"],
      },
    },
  },
  required: ["title", "summary", "steps", "checklist"],
};

interface RawGeminiVideoSop {
  title?: unknown;
  summary?: unknown;
  steps?: unknown;
  checklist?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeVideoSopOutput(
  parsed: unknown,
  fallbackTitle: string,
): {
  title: string;
  summary: string;
  steps: VideoSopStep[];
  checklist: VideoSopChecklistItem[];
} {
  const data: RawGeminiVideoSop = isRecord(parsed) ? parsed : {};

  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title.trim()
      : fallbackTitle;
  const summary =
    typeof data.summary === "string" && data.summary.trim()
      ? data.summary.trim()
      : "AI-extracted shop-floor standard operating procedure.";

  const rawSteps = Array.isArray(data.steps) ? data.steps : [];
  const steps: VideoSopStep[] = rawSteps
    .filter(isRecord)
    .slice(0, 10)
    .map((item, idx) => {
      const stepNum =
        typeof item.step_number === "number" && Number.isFinite(item.step_number)
          ? Math.max(1, Math.round(item.step_number))
          : idx + 1;
      const timestampSec =
        typeof item.timestamp_sec === "number" &&
        Number.isFinite(item.timestamp_sec)
          ? Math.max(0, Math.round(item.timestamp_sec))
          : 0;
      const stepTitle =
        typeof item.title === "string" && item.title.trim()
          ? item.title.trim()
          : `Step ${stepNum}`;
      const stepDesc =
        typeof item.description === "string" ? item.description.trim() : "";

      const translationsMap: Record<string, StepTranslation> = {};
      if (Array.isArray(item.translations)) {
        for (const tr of item.translations) {
          if (!isRecord(tr)) continue;
          const lang =
            typeof tr.language === "string" ? tr.language.trim() : "";
          if (!lang) continue;
          translationsMap[lang] = {
            title:
              typeof tr.title === "string" && tr.title.trim()
                ? tr.title.trim()
                : stepTitle,
            description:
              typeof tr.description === "string"
                ? tr.description.trim()
                : stepDesc,
          };
        }
      }

      return {
        step_number: stepNum,
        timestamp_sec: timestampSec,
        title: stepTitle,
        description: stepDesc,
        translations_json: translationsMap,
      };
    });

  const rawChecklist = Array.isArray(data.checklist) ? data.checklist : [];
  const checklist: VideoSopChecklistItem[] = rawChecklist
    .filter(isRecord)
    .slice(0, 6)
    .map((item) => ({
      label:
        typeof item.label === "string" && item.label.trim()
          ? item.label.trim()
          : "Verify step completed safely",
      required: typeof item.required === "boolean" ? item.required : true,
    }));

  return { title, summary, steps, checklist };
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

  const fileEntry = formData.get("video") ?? formData.get("file");
  if (!(fileEntry instanceof File)) {
    return NextResponse.json(
      { error: "Missing video file in form data." },
      { status: 400 },
    );
  }

  if (fileEntry.size === 0) {
    return NextResponse.json(
      { error: "Uploaded video file is empty." },
      { status: 400 },
    );
  }

  if (fileEntry.size > MAX_VIDEO_BYTES) {
    return NextResponse.json(
      { error: "Video file exceeds the 25MB upload limit." },
      { status: 413 },
    );
  }

  if (fileEntry.type && !fileEntry.type.startsWith("video/")) {
    return NextResponse.json(
      { error: `Unsupported file type "${fileEntry.type}". Upload a video file.` },
      { status: 400 },
    );
  }

  const optionalTitleEntry = formData.get("title");
  const optionalTitle =
    typeof optionalTitleEntry === "string" && optionalTitleEntry.trim()
      ? optionalTitleEntry.trim()
      : "Shop-Floor Video SOP";

  const languages = parseLanguagesField(formData.getAll("languages"));
  const managerWhatsappEntry = formData.get("manager_whatsapp");
  const managerWhatsapp =
    typeof managerWhatsappEntry === "string" && managerWhatsappEntry.trim()
      ? managerWhatsappEntry.trim()
      : undefined;

  let ai: ReturnType<typeof getGeminiClient>;
  try {
    ai = getGeminiClient();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gemini client unavailable.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  let uploadedFileName: string | undefined;

  try {
    const uploaded = await ai.files.upload({
      file: fileEntry,
      config: {
        mimeType: fileEntry.type || "video/mp4",
        displayName: fileEntry.name || "shop-floor-sop-video",
      },
    });

    uploadedFileName = uploaded.name;
    let activeFile = uploaded;

    for (let attempt = 0; attempt < FILE_POLL_MAX_ATTEMPTS; attempt += 1) {
      if (activeFile.state === FileState.ACTIVE) break;
      if (activeFile.state === FileState.FAILED) {
        throw new Error(
          activeFile.error?.message ||
            "Gemini failed to process the uploaded video.",
        );
      }
      await sleep(FILE_POLL_INTERVAL_MS);
      if (!uploadedFileName) break;
      activeFile = await ai.files.get({ name: uploadedFileName });
    }

    if (activeFile.state !== FileState.ACTIVE || !activeFile.uri) {
      throw new Error(
        "Timed out waiting for Gemini to process the uploaded video.",
      );
    }

    const prompt = [
      "You are an industrial operations engineer creating a frontline Standard Operating Procedure (SOP) from a shop-floor video.",
      `Requested title hint: "${optionalTitle}".`,
      `Target worker languages for translations: ${languages.join(", ")}.`,
      "Analyze the video carefully and return JSON matching the schema:",
      "1. Extract a clear, concise SOP `title` and a 1-2 sentence `summary`.",
      "2. Break the procedure into 3 to 10 concise, numbered operational `steps` with `step_number` (1-indexed), `timestamp_sec` (integer seconds where the step starts), `title`, `description`, and `translations` array containing an entry for EVERY requested language.",
      "3. Generate a 3 to 6 item interactive QC `checklist` (`label`, `required`) for frontline sign-off.",
    ].join("\n");

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        createPartFromUri(
          activeFile.uri,
          activeFile.mimeType || fileEntry.type || "video/mp4",
        ),
        prompt,
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: VIDEO_SOP_SCHEMA,
      },
    });

    const parsed = parseGeminiJson(response.text);
    const normalized = normalizeVideoSopOutput(parsed, optionalTitle);

    const configJson = {
      summary: normalized.summary,
      checklist: normalized.checklist,
      languages,
      ...(managerWhatsapp ? { manager_whatsapp: managerWhatsapp } : {}),
    } as unknown as Json;

    const persisted = await persistAiQrRecord({
      type: "video_sop",
      category: "sop",
      title: normalized.title,
      description: normalized.summary,
      configJson,
      steps: normalized.steps,
      showWatermark: !isPaidPlan(guard.planStatus.effectivePlan),
    });

    await incrementUserAiSopsUsed(guard.supabase, user.id);

    const payload: VideoSopApiResponse = {
      short_code: persisted.short_code,
      id: persisted.id,
      title: normalized.title,
      summary: normalized.summary,
      steps: normalized.steps,
      checklist: normalized.checklist,
      show_watermark: persisted.show_watermark,
      isLocalFallback: persisted.isLocalFallback,
      notice: persisted.notice,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to extract SOP from video.";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (uploadedFileName) {
      try {
        await ai.files.delete({ name: uploadedFileName });
      } catch {
        // Ignore cleanup errors so they never mask the primary response.
      }
    }
  }
}
