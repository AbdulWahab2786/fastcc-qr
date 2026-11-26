"use client";

import { useState, type DragEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Video,
  Camera,
  Link2,
  FileText,
  Upload,
  Download,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Package,
  Wrench,
  Tag,
  Users,
} from "lucide-react";
import { QrCodePreview } from "@/components/QrCodePreview";
import {
  createGuestQrCode,
  getQrScanUrl,
  saveLocalQrRecord,
  saveLocalSopSteps,
  TEMPLATE_PRESETS,
  type TemplatePreset,
} from "@/lib/qr-utils";
import { downloadQrPng, downloadQrSvg } from "@/lib/qr-export";
import type { PaperFormApiResponse, VideoSopApiResponse } from "@/types/ai";
import type { Json } from "@/types/database";

type WorkbenchTab = "video" | "paper" | "url" | "text";

const AI_LANGUAGES = ["English", "Hindi", "Hinglish", "Telugu", "Tamil"] as const;
type AiLanguage = (typeof AI_LANGUAGES)[number];

const TEMPLATE_ICONS: Record<string, typeof Package> = {
  "d2c-packing-sop": Package,
  "machine-maintenance-log": Wrench,
  "fixed-asset-tag": Tag,
  "shift-attendance": Users,
};

interface ActivePreview {
  shortCode: string;
  title: string;
  subtitle: string;
  isLocalFallback: boolean;
  isDemo: boolean;
}

export function HomeWorkbench() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<WorkbenchTab>("url");

  // Standard URL & File/Text inputs
  const [urlTitle, setUrlTitle] = useState("Line B — Safety & Startup Guide");
  const [urlTarget, setUrlTarget] = useState("https://fastcc.app/sop/line-b");
  const [textTitle, setTextTitle] = useState("Compressor Daily Check");
  const [textBody, setTextBody] = useState(
    "1. Check oil sight glass.\n2. Drain moisture trap.\n3. Verify 8 bar cutout.",
  );

  // AI Video-to-SOP & AI Paper-to-Form inputs
  const [aiLanguage, setAiLanguage] = useState<AiLanguage>("Hinglish");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);

  // Generation & Preview state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [launchingTemplateId, setLaunchingTemplateId] = useState<string | null>(
    null,
  );
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState<ActivePreview>({
    shortCode: "demo",
    title: "D2C Packing Station #04",
    subtitle: "Scan for Hindi/English Steps",
    isLocalFallback: false,
    isDemo: true,
  });

  const scanUrl = getQrScanUrl(preview.shortCode);

  async function handleGeneratePermanentQr() {
    setIsSubmitting(true);
    setBannerNotice(null);

    const isUrlTab = activeTab === "url";
    const title = isUrlTab ? urlTitle : textTitle;
    const description = isUrlTab ? urlTarget : textBody;
    const category = isUrlTab ? "url" : "text";

    const result = await createGuestQrCode({
      title,
      description,
      category,
    });

    setPreview({
      shortCode: result.record.short_code,
      title: result.record.title,
      subtitle: result.record.description
        ? result.record.description.slice(0, 64)
        : "Scan for instructions",
      isLocalFallback: result.isLocalFallback,
      isDemo: false,
    });

    if (result.isLocalFallback && result.notice) {
      setBannerNotice(result.notice);
    }
    setIsSubmitting(false);
  }

  async function handleAiSubmit(mode: "video" | "paper") {
    const selectedFile = mode === "video" ? videoFile : paperFile;
    setAiStatusMessage(null);
    setAiErrorMessage(null);
    setBannerNotice(null);

    if (!selectedFile) {
      setAiErrorMessage(
        mode === "video"
          ? "Select or drop a 60s shop-floor video first."
          : "Select or drop a photo of a paper checklist first.",
      );
      return;
    }

    if (mode === "video" && selectedFile.size > 25 * 1024 * 1024) {
      setAiErrorMessage("Video file exceeds the 25MB limit. Trim to ~60s and retry.");
      return;
    }

    const endpoint =
      mode === "video" ? "/api/ai/video-sop" : "/api/ai/paper-form";
    const fieldName = mode === "video" ? "video" : "image";
    const formData = new FormData();
    formData.append(fieldName, selectedFile);
    formData.append("languages", JSON.stringify([aiLanguage]));

    setIsAiProcessing(true);
    setAiStatusMessage(
      mode === "video"
        ? "AI is watching your video and building steps..."
        : "AI is reading your paper checklist and building form fields...",
    );

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const body = (await response.json()) as
        | (VideoSopApiResponse & { error?: undefined })
        | (PaperFormApiResponse & { error?: undefined })
        | { error: string };

      if (!response.ok || "error" in body) {
        const message =
          "error" in body && body.error
            ? body.error
            : `AI request failed with status ${response.status}.`;
        setAiStatusMessage(null);
        setAiErrorMessage(message);
        return;
      }

      const now = new Date().toISOString();
      if (mode === "video") {
        const videoResult = body as VideoSopApiResponse;
        saveLocalQrRecord({
          id: videoResult.id,
          short_code: videoResult.short_code,
          user_id: null,
          title: videoResult.title,
          description: videoResult.summary,
          category: "sop",
          type: "video_sop",
          config_json: {
            summary: videoResult.summary,
            checklist: videoResult.checklist,
            languages: [aiLanguage],
          } as unknown as Json,
          show_watermark: true,
          created_at: now,
          updated_at: now,
        });

        saveLocalSopSteps(
          [videoResult.short_code, videoResult.id],
          videoResult.steps.map((step) => ({
            id: `${videoResult.id}-step-${step.step_number}`,
            qr_code_id: videoResult.id,
            step_order: step.step_number,
            title: step.title,
            instruction: step.description,
            is_critical: false,
            timestamp_sec: step.timestamp_sec,
            translations_json: step.translations_json as unknown as Json,
            created_at: now,
          })),
        );

        setPreview({
          shortCode: videoResult.short_code,
          title: videoResult.title,
          subtitle: `${videoResult.steps.length} SOP steps • ${aiLanguage}`,
          isLocalFallback: Boolean(videoResult.isLocalFallback),
          isDemo: false,
        });
        setAiStatusMessage(
          `Extracted ${videoResult.steps.length} SOP steps and ${videoResult.checklist.length} QC checks for "${videoResult.title}".`,
        );
        if (videoResult.isLocalFallback && videoResult.notice) {
          setBannerNotice(videoResult.notice);
        }
      } else {
        const paperResult = body as PaperFormApiResponse;
        saveLocalQrRecord({
          id: paperResult.id,
          short_code: paperResult.short_code,
          user_id: null,
          title: paperResult.title,
          description: `Digitized mobile inspection form (${paperResult.fields.length} fields).`,
          category: "checklist",
          type: "paper_form",
          config_json: {
            fields: paperResult.fields,
            languages: [aiLanguage],
          } as unknown as Json,
          show_watermark: true,
          created_at: now,
          updated_at: now,
        });

        setPreview({
          shortCode: paperResult.short_code,
          title: paperResult.title,
          subtitle: `${paperResult.fields.length} form fields • ${aiLanguage}`,
          isLocalFallback: Boolean(paperResult.isLocalFallback),
          isDemo: false,
        });
        setAiStatusMessage(
          `Digitized ${paperResult.fields.length} inspection fields for "${paperResult.title}".`,
        );
        if (paperResult.isLocalFallback && paperResult.notice) {
          setBannerNotice(paperResult.notice);
        }
      }
    } catch {
      setAiStatusMessage(null);
      setAiErrorMessage(
        "Network error while contacting the AI pipeline. Please try again.",
      );
    } finally {
      setIsAiProcessing(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>, mode: "video" | "paper") {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setAiStatusMessage(null);
    setAiErrorMessage(null);
    if (mode === "video") {
      setVideoFile(file);
    } else {
      setPaperFile(file);
    }
  }

  function handleFileChange(
    e: ChangeEvent<HTMLInputElement>,
    mode: "video" | "paper",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAiStatusMessage(null);
    setAiErrorMessage(null);
    if (mode === "video") {
      setVideoFile(file);
    } else {
      setPaperFile(file);
    }
  }

  async function handleLaunchTemplate(preset: TemplatePreset) {
    setLaunchingTemplateId(preset.id);
    const result = await createGuestQrCode({
      title: preset.title,
      description: preset.description,
      category: preset.category,
    });
    setLaunchingTemplateId(null);
    router.push(`/studio/${result.record.short_code}`);
  }

  const tabs: { id: WorkbenchTab; label: string; icon: typeof Video }[] = [
    { id: "video", label: "AI Video-to-SOP", icon: Video },
    { id: "paper", label: "AI Paper-to-Form", icon: Camera },
    { id: "url", label: "Standard URL", icon: Link2 },
    { id: "text", label: "File / Text", icon: FileText },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Subtle Local Fallback Banner */}
      {bannerNotice ? (
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs text-ink-muted">
          <AlertCircle className="h-4 w-4 shrink-0 text-utility-blue" />
          <span>{bannerNotice}</span>
        </div>
      ) : null}

      {/* Hero 2-Column CaoLiao-Style Workbench */}
      <section aria-label="Instant QR Workbench">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Instant Operations QR &amp; SOP Generator
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              No login required. Generate a permanent QR code, print a shop-floor
              label, and log frontline checks.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-ink-muted">
            ECC Level H • Permanent ID
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Tabbed Input */}
          <div className="rounded-xl border border-border bg-surface lg:col-span-7">
            {/* Tab Bar */}
            <div
              role="tablist"
              aria-label="QR Generator Mode"
              className="grid grid-cols-2 border-b border-border bg-canvas-muted/60 sm:grid-cols-4"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setAiStatusMessage(null);
                      setAiErrorMessage(null);
    setAiErrorMessage(null);
                    }}
                    className={`flex items-center justify-center gap-1.5 border-b-2 px-3 py-3 text-xs font-medium transition-colors sm:text-sm ${
                      isActive
                        ? "border-action-green bg-surface text-ink"
                        : "border-transparent text-ink-muted hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div className="p-5 sm:p-6">
              {activeTab === "url" ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="url-title"
                      className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
                    >
                      Label / SOP Title
                    </label>
                    <input
                      id="url-title"
                      type="text"
                      value={urlTitle}
                      onChange={(e) => setUrlTitle(e.target.value)}
                      placeholder="e.g., CNC Milling Machine #02 SOP"
                      className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-utility-blue"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="url-target"
                      className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
                    >
                      Destination URL or Reference Link
                    </label>
                    <input
                      id="url-target"
                      type="url"
                      value={urlTarget}
                      onChange={(e) => setUrlTarget(e.target.value)}
                      placeholder="https://..."
                      className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 font-mono text-sm text-ink outline-none focus:border-utility-blue"
                    />
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleGeneratePermanentQr}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-action-green px-5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60 sm:w-auto"
                    >
                      {isSubmitting
                        ? "Generating Permanent QR..."
                        : "Generate Permanent QR"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}

              {activeTab === "text" ? (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="text-title"
                      className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
                    >
                      Label / Checklist Title
                    </label>
                    <input
                      id="text-title"
                      type="text"
                      value={textTitle}
                      onChange={(e) => setTextTitle(e.target.value)}
                      placeholder="e.g., Shift Handover Instructions"
                      className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-utility-blue"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="text-body"
                      className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
                    >
                      Instructions / Text Content
                    </label>
                    <textarea
                      id="text-body"
                      rows={5}
                      value={textBody}
                      onChange={(e) => setTextBody(e.target.value)}
                      placeholder="Enter step-by-step instructions or asset notes..."
                      className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-utility-blue"
                    />
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleGeneratePermanentQr}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-action-green px-5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60 sm:w-auto"
                    >
                      {isSubmitting
                        ? "Generating Permanent QR..."
                        : "Generate Permanent QR"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}

              {activeTab === "video" || activeTab === "paper" ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold text-ink">
                        {activeTab === "video"
                          ? "Upload 60s Shop-Floor Video"
                          : "Upload Paper Checklist Photo"}
                      </h2>
                      <p className="text-xs text-ink-muted">
                        {activeTab === "video"
                          ? "Record a quick walkthrough; AI extracts numbered SOP steps."
                          : "Snap a printed logbook or clipboard; AI digitizes it into a mobile form."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="ai-language"
                        className="text-xs font-medium text-ink-muted"
                      >
                        Output Language
                      </label>
                      <select
                        id="ai-language"
                        value={aiLanguage}
                        onChange={(e) =>
                          setAiLanguage(e.target.value as AiLanguage)
                        }
                        className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink outline-none focus:border-utility-blue"
                      >
                        {AI_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => handleDrop(e, activeTab)}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
                      isDragging
                        ? "border-utility-blue bg-utility-blue/5"
                        : "border-border bg-canvas hover:bg-canvas-muted/70"
                    }`}
                  >
                    <Upload className="h-7 w-7 text-ink-muted" />
                    <span className="mt-2 text-sm font-medium text-ink">
                      {activeTab === "video"
                        ? "Drop MP4 / MOV video (max 60s) or click to browse"
                        : "Drop JPG / PNG checklist photo or click to browse"}
                    </span>
                    <span className="mt-1 text-xs text-ink-muted">
                      Target language: {aiLanguage}
                    </span>
                    <input
                      type="file"
                      accept={activeTab === "video" ? "video/*" : "image/*"}
                      onChange={(e) => handleFileChange(e, activeTab)}
                      className="sr-only"
                    />
                  </label>

                  {(activeTab === "video" ? videoFile : paperFile) ? (
                    <div className="flex items-center justify-between rounded-lg border border-border bg-canvas-muted/60 px-3.5 py-2 text-xs">
                      <span className="truncate font-mono text-ink">
                        {(activeTab === "video" ? videoFile : paperFile)?.name}
                      </span>
                      <span className="shrink-0 text-ink-muted">
                        {(
                          ((activeTab === "video" ? videoFile : paperFile)
                            ?.size ?? 0) /
                          (1024 * 1024)
                        ).toFixed(2)}{" "}
                        MB
                      </span>
                    </div>
                  ) : null}

                  {aiErrorMessage ? (
                    <div className="flex items-start gap-2 rounded-lg border border-alert-red/30 bg-alert-red/5 px-3.5 py-2.5 text-xs text-alert-red">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{aiErrorMessage}</span>
                    </div>
                  ) : null}

                  {aiStatusMessage ? (
                    <div className="flex items-start gap-2 rounded-lg border border-utility-blue/30 bg-utility-blue/5 px-3.5 py-2.5 text-xs text-ink">
                      {isAiProcessing ? (
                        <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-utility-blue" />
                      ) : (
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-utility-blue" />
                      )}
                      <span>{aiStatusMessage}</span>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      disabled={isAiProcessing}
                      onClick={() => handleAiSubmit(activeTab)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-action-green px-5 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                    >
                      {isAiProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      {isAiProcessing
                        ? activeTab === "video"
                          ? "Analyzing Video..."
                          : "Digitizing Form..."
                        : activeTab === "video"
                          ? "Extract SOP from Video"
                          : "Digitize Paper Checklist"}
                    </button>
                    <span className="text-xs text-ink-muted">
                      Powered by Gemini 3.8 Flash
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Column: Live QR Preview */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 sm:p-6 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  <CheckCircle2 className="h-4 w-4 text-action-green" />
                  Live QR Preview
                </span>
                <span className="rounded border border-border bg-canvas-muted px-2 py-0.5 font-mono text-xs text-ink">
                  {preview.shortCode}
                </span>
              </div>

              <div className="mt-4 flex flex-col items-center rounded-xl border border-border bg-canvas p-5 text-center">
                <QrCodePreview value={scanUrl} size={208} />
                <p className="mt-3 text-sm font-semibold text-ink">
                  {preview.title}
                </p>
                <p className="mt-0.5 font-mono text-xs text-ink-muted">
                  /q/{preview.shortCode}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    downloadQrPng(scanUrl, `fastcc-${preview.shortCode}.png`)
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted"
                >
                  <Download className="h-4 w-4 text-utility-blue" />
                  Download PNG
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadQrSvg(scanUrl, `fastcc-${preview.shortCode}.svg`)
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted"
                >
                  <Download className="h-4 w-4 text-utility-blue" />
                  Download SVG
                </button>
              </div>

              <Link
                href={`/studio/${preview.shortCode}`}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-utility-blue px-4 text-sm font-semibold text-white transition-opacity hover:opacity-95"
              >
                Open Label Studio
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 1-Click Template Gallery (Below the Fold) */}
      <section id="templates" className="mt-12 border-t border-border pt-10">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-semibold text-ink sm:text-xl">
              1-Click Operational Templates
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Launch a pre-configured QR label in Label Studio with one click.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATE_PRESETS.map((preset) => {
            const Icon = TEMPLATE_ICONS[preset.id] ?? Package;
            const isLoading = launchingTemplateId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                disabled={launchingTemplateId !== null}
                onClick={() => handleLaunchTemplate(preset)}
                className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 text-left transition-colors hover:border-utility-blue disabled:opacity-60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-canvas-muted text-ink">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded border border-border bg-canvas px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                      {preset.badge}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-sm font-semibold text-ink group-hover:text-utility-blue">
                    {preset.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-utility-blue">
                  {isLoading ? "Creating Studio..." : "Use Template"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
