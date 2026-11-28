import { NextResponse } from "next/server";
import { createPartFromUri, FileState, Type, type Schema } from "@google/genai";
import { generateGroqVisionJson, type GroqImageInput } from "@/lib/ai/groq";
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
import { normalizeInspectionSchedule } from "@/lib/inspection-schedule";
import type { Json } from "@/types/database";
import type {
  StepTranslation,
  VideoSopApiResponse,
  VideoSopChecklistItem,
  VideoSopStep,
} from "@/types/ai";

const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_FRAMES = 5;
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

  const frameEntries = formData
    .getAll("frames")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, MAX_FRAMES);

  const imageEntry = formData.get("image");
  const rawFileEntry = formData.get("video") ?? formData.get("file");

  const singleImageFile =
    imageEntry instanceof File && imageEntry.size > 0
      ? imageEntry
      : rawFileEntry instanceof File &&
          rawFileEntry.size > 0 &&
          rawFileEntry.type.startsWith("image/")
        ? rawFileEntry
        : null;

  const videoFile =
    rawFileEntry instanceof File &&
    rawFileEntry.size > 0 &&
    !rawFileEntry.type.startsWith("image/")
      ? rawFileEntry
      : null;

  if (frameEntries.length === 0 && !singleImageFile && !videoFile) {
    return NextResponse.json(
      { error: "Missing video frames, image, or video file in form data." },
      { status: 400 },
    );
  }

  for (const frame of frameEntries) {
    if (frame.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Extracted frame exceeds the 15MB upload limit." },
        { status: 413 },
      );
    }
    if (frame.type && !frame.type.startsWith("image/")) {
      return NextResponse.json(
        { error: `Unsupported frame type "${frame.type}".` },
        { status: 400 },
      );
    }
  }

  if (singleImageFile) {
    if (singleImageFile.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image file exceeds the 15MB upload limit." },
        { status: 413 },
      );
    }
    if (singleImageFile.type && !singleImageFile.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: `Unsupported file type "${singleImageFile.type}". Upload an image file.`,
        },
        { status: 400 },
      );
    }
  }

  if (videoFile) {
    if (videoFile.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: "Video file exceeds the 25MB upload limit." },
        { status: 413 },
      );
    }
    if (videoFile.type && !videoFile.type.startsWith("video/")) {
      return NextResponse.json(
        {
          error: `Unsupported file type "${videoFile.type}". Upload a video file.`,
        },
        { status: 400 },
      );
    }
  }

  const optionalTitleEntry = formData.get("title");
  const optionalTitle =
    typeof optionalTitleEntry === "string" && optionalTitleEntry.trim()
      ? optionalTitleEntry.trim()
      : "Shop-Floor Video SOP";

  const durationEntry = formData.get("video_duration_sec");
  const videoDurationSec =
    typeof durationEntry === "string" && Number.isFinite(Number(durationEntry))
      ? Math.max(1, Math.round(Number(durationEntry)))
      : null;

  const languages = parseLanguagesField(formData.getAll("languages"));
  const managerWhatsappEntry = formData.get("manager_whatsapp");
  const managerWhatsapp =
    typeof managerWhatsappEntry === "string" && managerWhatsappEntry.trim()
      ? managerWhatsappEntry.trim()
      : undefined;
  const folderEntry = formData.get("folder");
  const folder =
    typeof folderEntry === "string" &&
    folderEntry.trim() &&
    folderEntry.trim().toLowerCase() !== "unassigned"
      ? folderEntry.trim()
      : undefined;
  const inspectionSchedule = normalizeInspectionSchedule(
    formData.get("inspection_schedule"),
  );

  let uploadedFileName: string | undefined;
  let geminiClientForCleanup: ReturnType<typeof getGeminiClient> | null = null;

  try {
    const sourceImages =
      frameEntries.length > 0
        ? frameEntries
        : singleImageFile
          ? [singleImageFile]
          : [];

    const imageInputs: GroqImageInput[] = await Promise.all(
      sourceImages.map(async (imgFile) => ({
        base64Data: Buffer.from(await imgFile.arrayBuffer()).toString("base64"),
        mimeType: imgFile.type || "image/jpeg",
      })),
    );

    const mediaContextHint =
      frameEntries.length > 0
        ? `You are analyzing ${frameEntries.length} sequential key frames extracted from a shop-floor SOP video${videoDurationSec ? ` (~${videoDurationSec}s total duration)` : ""}.`
        : singleImageFile
          ? "You are analyzing a shop-floor equipment or process image to build a frontline SOP."
          : "You are analyzing a shop-floor video to build a frontline SOP.";

    const prompt = [
      "You are an industrial operations engineer creating a frontline Standard Operating Procedure (SOP).",
      mediaContextHint,
      `Requested title hint: "${optionalTitle}".`,
      `Target worker languages for translations: ${languages.join(", ")}.`,
      "Return ONLY valid JSON matching this exact structure:",
      "{",
      '  "title": "Clear, concise SOP title",',
      '  "summary": "1-2 sentence operational summary",',
      '  "steps": [',
      "    {",
      '      "step_number": 1,',
      '      "timestamp_sec": 0,',
      '      "title": "Step title",',
      '      "description": "Clear operational instruction",',
      '      "translations": [{ "language": "LanguageName", "title": "Translated title", "description": "Translated instruction" }]',
      "    }",
      "  ],",
      '  "checklist": [',
      '    { "label": "Frontline QC sign-off check", "required": true }',
      "  ]",
      "}",
      "Include 3 to 10 numbered `steps` (with `translations` for EVERY requested language) and 3 to 6 `checklist` items.",
    ].join("\n");

    let parsed: unknown;
    let groqError: unknown;

    if (imageInputs.length > 0) {
      try {
        parsed = await generateGroqVisionJson({
          prompt,
          images: imageInputs,
        });
      } catch (err) {
        groqError = err;
      }
    }

    if (parsed === undefined) {
      try {
        const ai = getGeminiClient();
        geminiClientForCleanup = ai;

        if (videoFile) {
          const uploaded = await ai.files.upload({
            file: videoFile,
            config: {
              mimeType: videoFile.type || "video/mp4",
              displayName: videoFile.name || "shop-floor-sop-video",
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

          const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
              createPartFromUri(
                activeFile.uri,
                activeFile.mimeType || videoFile.type || "video/mp4",
              ),
              prompt,
            ],
            config: {
              responseMimeType: "application/json",
              responseSchema: VIDEO_SOP_SCHEMA,
            },
          });

          parsed = parseGeminiJson(response.text);
        } else if (imageInputs.length > 0) {
          const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
              ...imageInputs.map((img) => ({
                inlineData: {
                  data: img.base64Data,
                  mimeType: img.mimeType,
                },
              })),
              prompt,
            ],
            config: {
              responseMimeType: "application/json",
              responseSchema: VIDEO_SOP_SCHEMA,
            },
          });

          parsed = parseGeminiJson(response.text);
        } else {
          throw new Error("No media available for Gemini fallback.");
        }
      } catch (geminiErr) {
        const groqMsg =
          groqError instanceof Error ? groqError.message : null;
        const geminiMsg =
          geminiErr instanceof Error
            ? geminiErr.message
            : "Gemini fallback failed";
        throw new Error(
          groqMsg ? `${groqMsg}; fallback error: ${geminiMsg}` : geminiMsg,
        );
      }
    }

    const normalized = normalizeVideoSopOutput(parsed, optionalTitle);

    const configJson = {
      summary: normalized.summary,
      checklist: normalized.checklist,
      languages,
      ...(managerWhatsapp ? { manager_whatsapp: managerWhatsapp } : {}),
      ...(folder ? { folder } : {}),
      ...(inspectionSchedule !== "none"
        ? { inspection_schedule: inspectionSchedule }
        : {}),
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
    if (uploadedFileName && geminiClientForCleanup) {
      try {
        await geminiClientForCleanup.files.delete({ name: uploadedFileName });
      } catch {
        // Ignore cleanup errors so they never mask the primary response.
      }
    }
  }
}
