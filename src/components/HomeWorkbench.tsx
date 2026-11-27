"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type DragEvent,
  type ChangeEvent,
} from "react";
import Link from "next/link";
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
  Lock,
  Utensils,
  Zap,
  Flame,
  Truck,
  MessageCircle,
  Plus,
  X,
  ClipboardList,
  Folder,
} from "lucide-react";
import { QrCodePreview } from "@/components/QrCodePreview";
import {
  buildSopConfigJson,
  formatTemplateStepsText,
  getIndustryTemplateById,
  INDUSTRY_TEMPLATES,
  parseSopStepsFromText,
  type IndustryTemplate,
} from "@/lib/industry-templates";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  createGuestQrCode,
  EMPTY_FOLDER_SUGGESTIONS,
  extractUniqueFolders,
  getLocalFolderSuggestions,
  getQrScanUrl,
  saveLocalQrRecord,
  saveLocalSopSteps,
} from "@/lib/qr-utils";
import { downloadQrPng, downloadQrSvg } from "@/lib/qr-export";
import type {
  PaperFormApiResponse,
  VideoSopApiResponse,
  VideoSopChecklistItem,
} from "@/types/ai";
import type { Json } from "@/types/database";

type WorkbenchTab = "video" | "paper" | "url" | "text";

const AI_LANGUAGES = ["English", "Hindi", "Hinglish", "Telugu", "Tamil"] as const;
type AiLanguage = (typeof AI_LANGUAGES)[number];

const INDUSTRY_TEMPLATE_ICONS: Record<string, typeof Utensils> = {
  "fssai-kitchen-cleaning": Utensils,
  "dg-set-daily-check": Zap,
  "fire-extinguisher-audit": Flame,
  "warehouse-forklift-check": Truck,
};

interface ActivePreview {
  shortCode: string;
  title: string;
  subtitle: string;
  isLocalFallback: boolean;
  isDemo: boolean;
}

const subscribeNoop = () => () => {};

interface HomeWorkbenchProps {
  initialTemplateId?: string;
}

export function HomeWorkbench({ initialTemplateId }: HomeWorkbenchProps) {
  const initialTemplate = getIndustryTemplateById(initialTemplateId);

  const [activeTab, setActiveTab] = useState<WorkbenchTab>(() =>
    initialTemplate ? "text" : "url",
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    () => initialTemplate?.id ?? null,
  );

  // Standard URL & SOP/Checklist inputs
  const [urlTitle, setUrlTitle] = useState("Line B — Safety & Startup Guide");
  const [urlTarget, setUrlTarget] = useState("https://fastcc.app/sop/line-b");
  const [textTitle, setTextTitle] = useState(() =>
    initialTemplate ? initialTemplate.title : "Compressor Daily Check",
  );
  const [sopCategory, setSopCategory] = useState(() =>
    initialTemplate ? initialTemplate.category : "Operations",
  );
  const [textBody, setTextBody] = useState(() =>
    initialTemplate
      ? formatTemplateStepsText(initialTemplate.steps)
      : "1. Check oil sight glass.\n2. Drain moisture trap.\n3. Verify 8 bar cutout.",
  );
  const [checklistItems, setChecklistItems] = useState<VideoSopChecklistItem[]>(
    () =>
      initialTemplate
        ? initialTemplate.checklist.map((item) => ({ ...item }))
        : [],
  );
  const [newChecklistLabel, setNewChecklistLabel] = useState("");
  const [managerWhatsapp, setManagerWhatsapp] = useState("");
  const [siteFolder, setSiteFolder] = useState("");
  const [remoteFolders, setRemoteFolders] = useState<string[]>([]);
  const [createdFolders, setCreatedFolders] = useState<string[]>([]);

  const localFolders = useSyncExternalStore(
    subscribeNoop,
    getLocalFolderSuggestions,
    () => EMPTY_FOLDER_SUGGESTIONS,
  );

  const existingFolders = useMemo(
    () =>
      Array.from(
        new Set([...localFolders, ...remoteFolders, ...createdFolders]),
      ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })),
    [localFolders, remoteFolders, createdFolders],
  );

  // AI Video-to-SOP & AI Paper-to-Form inputs
  const [aiLanguage, setAiLanguage] = useState<AiLanguage>("Hinglish");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [aiAuthRequired, setAiAuthRequired] = useState(false);
  const [aiUpgradeMessage, setAiUpgradeMessage] = useState<string | null>(null);
  const [qrUpgradeMessage, setQrUpgradeMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv()) return;
    let active = true;
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        if (!active) return;
        setIsAuthenticated(Boolean(user));
        if (!user) return;

        const { data: rows } = await supabase
          .from("qr_codes")
          .select("config_json")
          .eq("user_id", user.id);

        if (!active || !rows) return;
        setRemoteFolders(extractUniqueFolders(rows));
      })
      .catch(() => {
        if (active) setIsAuthenticated(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Generation & Preview state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState<ActivePreview>({
    shortCode: "demo",
    title: "D2C Packing Station #04",
    subtitle: "Scan for Hindi/English Steps",
    isLocalFallback: false,
    isDemo: true,
  });

  const scanUrl = getQrScanUrl(preview.shortCode);
  const selectedTemplate = getIndustryTemplateById(selectedTemplateId);

  function applyIndustryTemplate(
    template: IndustryTemplate,
    options?: { scrollToWorkbench?: boolean },
  ) {
    setSelectedTemplateId(template.id);
    setActiveTab("text");
    setTextTitle(template.title);
    setSopCategory(template.category);
    setTextBody(formatTemplateStepsText(template.steps));
    setChecklistItems(template.checklist.map((item) => ({ ...item })));
    setAiStatusMessage(null);
    setAiErrorMessage(null);
    setAiUpgradeMessage(null);
    setAiAuthRequired(false);
    setBannerNotice(null);

    if (options?.scrollToWorkbench && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleAddChecklistItem() {
    const trimmed = newChecklistLabel.trim();
    if (!trimmed) return;
    setChecklistItems((prev) => [...prev, { label: trimmed, required: true }]);
    setNewChecklistLabel("");
  }

  function handleRemoveChecklistItem(index: number) {
    setChecklistItems((prev) => prev.filter((_, idx) => idx !== index));
  }

  function handleToggleChecklistRequired(index: number) {
    setChecklistItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, required: !item.required } : item,
      ),
    );
  }

  async function handleGeneratePermanentQr() {
    setIsSubmitting(true);
    setBannerNotice(null);
    setQrUpgradeMessage(null);

    const isUrlTab = activeTab === "url";
    const parsedSteps = isUrlTab
      ? []
      : parseSopStepsFromText(textBody, selectedTemplate?.steps ?? []);
    const isSopMode =
      !isUrlTab &&
      (checklistItems.length > 0 ||
        parsedSteps.length > 1 ||
        Boolean(selectedTemplate) ||
        Boolean(managerWhatsapp.trim()));

    const title = isUrlTab ? urlTitle : textTitle;
    const description = isUrlTab
      ? urlTarget
      : selectedTemplate?.description ?? textBody;
    const category = isUrlTab ? "url" : isSopMode ? sopCategory : "text";
    const trimmedWhatsapp = managerWhatsapp.trim();
    const rawFolder = siteFolder.trim();
    const normalizedFolder =
      rawFolder && rawFolder.toLowerCase() !== "unassigned" ? rawFolder : "";

    const configJson: Json | undefined = isUrlTab
      ? normalizedFolder
        ? ({ folder: normalizedFolder } as Json)
        : undefined
      : buildSopConfigJson({
          summary: selectedTemplate?.description,
          checklist: checklistItems,
          managerWhatsapp: trimmedWhatsapp,
          folder: normalizedFolder,
        });

    const result = await createGuestQrCode({
      title,
      description,
      category,
      type: isUrlTab ? "url" : isSopMode ? "sop" : "standard",
      configJson,
      steps: isSopMode ? parsedSteps : undefined,
    });

    if (result.blockedByPlanLimit || !result.record) {
      setQrUpgradeMessage(
        result.notice ||
          "Free plan limit reached (10/10 QR codes). Upgrade to Pro for unlimited QR codes.",
      );
      setIsSubmitting(false);
      return;
    }

    if (normalizedFolder) {
      setCreatedFolders((prev) =>
        prev.includes(normalizedFolder) ? prev : [...prev, normalizedFolder],
      );
    }

    setPreview({
      shortCode: result.record.short_code,
      title: result.record.title,
      subtitle: isSopMode
        ? `${parsedSteps.length} SOP steps • ${checklistItems.length} checks`
        : result.record.description
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
    setAiUpgradeMessage(null);
    setAiAuthRequired(false);
    setBannerNotice(null);

    let authed = isAuthenticated;
    if (!authed && hasSupabaseEnv()) {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        authed = Boolean(user);
        setIsAuthenticated(authed);
      } catch {
        authed = false;
      }
    }

    if (!authed) {
      setAiAuthRequired(true);
      return;
    }

    if (!selectedFile) {
      setAiErrorMessage(
        mode === "video"
          ? "Select or drop a 60s shop-floor video first."
          : "Select or drop a photo of a paper checklist first.",
      );
      return;
    }

    if (mode === "video" && selectedFile.size > 25 * 1024 * 1024) {
      setAiErrorMessage(
        "Video file exceeds the 25MB limit. Trim to ~60s and retry.",
      );
      return;
    }

    const endpoint =
      mode === "video" ? "/api/ai/video-sop" : "/api/ai/paper-form";
    const fieldName = mode === "video" ? "video" : "image";
    const rawFolder = siteFolder.trim();
    const normalizedFolder =
      rawFolder && rawFolder.toLowerCase() !== "unassigned" ? rawFolder : "";

    const formData = new FormData();
    formData.append(fieldName, selectedFile);
    formData.append("languages", JSON.stringify([aiLanguage]));
    if (managerWhatsapp.trim()) {
      formData.append("manager_whatsapp", managerWhatsapp.trim());
    }
    if (normalizedFolder) {
      formData.append("folder", normalizedFolder);
    }

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

      if (response.status === 401) {
        setIsAuthenticated(false);
        setAiAuthRequired(true);
        setAiStatusMessage(null);
        return;
      }

      if (response.status === 402) {
        const message =
          "error" in body && body.error
            ? body.error
            : "Plan limit reached. Upgrade to Pro to continue generating AI SOPs.";
        setAiStatusMessage(null);
        setAiUpgradeMessage(message);
        return;
      }

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
      const trimmedWhatsapp = managerWhatsapp.trim();

      if (normalizedFolder) {
        setCreatedFolders((prev) =>
          prev.includes(normalizedFolder) ? prev : [...prev, normalizedFolder],
        );
      }

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
            ...(trimmedWhatsapp ? { manager_whatsapp: trimmedWhatsapp } : {}),
            ...(normalizedFolder ? { folder: normalizedFolder } : {}),
          } as unknown as Json,
          show_watermark: Boolean(videoResult.show_watermark ?? true),
          scan_count: 0,
          last_scanned_at: null,
          current_status: "ok",
          last_inspected_at: null,
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
            ...(trimmedWhatsapp ? { manager_whatsapp: trimmedWhatsapp } : {}),
            ...(normalizedFolder ? { folder: normalizedFolder } : {}),
          } as unknown as Json,
          show_watermark: Boolean(paperResult.show_watermark ?? true),
          scan_count: 0,
          last_scanned_at: null,
          current_status: "ok",
          last_inspected_at: null,
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

  const tabs: { id: WorkbenchTab; label: string; icon: typeof Video }[] = [
    { id: "video", label: "AI Video-to-SOP", icon: Video },
    { id: "paper", label: "AI Paper-to-Form", icon: Camera },
    { id: "url", label: "Standard URL", icon: Link2 },
    { id: "text", label: "SOP / Checklist", icon: FileText },
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

      {/* Free Plan QR Limit Inline Upgrade Banner */}
      {qrUpgradeMessage ? (
        <div
          role="alert"
          className="mb-5 flex flex-col gap-3 rounded-lg border border-alert-red/30 bg-alert-red/5 px-4 py-3 text-xs text-ink sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-alert-red" />
            <span>{qrUpgradeMessage}</span>
          </div>
          <Link
            href="/pricing"
            className="inline-flex min-h-9 w-fit shrink-0 items-center justify-center gap-1.5 rounded-lg bg-action-green px-3.5 text-xs font-semibold text-white transition-opacity hover:opacity-95"
          >
            Upgrade to Pro
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      {/* Hero 2-Column CaoLiao-Style Workbench */}
      <section id="workbench-top" aria-label="Instant QR Workbench">
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
          {/* Left Column: Industry Template Picker + Tabbed Input */}
          <div className="rounded-xl border border-border bg-surface lg:col-span-7">
            {/* Start from Industry Template Picker */}
            <div className="border-b border-border bg-canvas/70 px-4 py-3.5 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink">
                  <ClipboardList className="h-3.5 w-3.5 text-action-green" />
                  Start from Industry Template
                </span>
                <span className="font-mono text-[11px] text-ink-muted">
                  1-click SOP + 5 checks
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {INDUSTRY_TEMPLATES.map((template) => {
                  const Icon =
                    INDUSTRY_TEMPLATE_ICONS[template.id] ?? ClipboardList;
                  const isSelected =
                    selectedTemplateId === template.id && activeTab === "text";
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => applyIndustryTemplate(template)}
                      className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? "border-action-green bg-action-green/10 text-ink"
                          : "border-border bg-surface text-ink hover:border-utility-blue"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                            isSelected
                              ? "border-action-green/30 bg-action-green text-white"
                              : "border-border bg-canvas-muted text-ink"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-ink">
                            {template.title}
                          </p>
                          <p className="truncate text-[11px] text-ink-muted">
                            {template.category}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
                    </button>
                  );
                })}
              </div>
            </div>

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
                      setAiUpgradeMessage(null);
                      setAiAuthRequired(false);
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
                  <div>
                    <label
                      htmlFor="url-site-folder"
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                    >
                      <Folder className="h-3.5 w-3.5 text-utility-blue" />
                      Location / Site Folder (Optional)
                    </label>
                    <input
                      id="url-site-folder"
                      type="text"
                      list="workbench-folder-suggestions"
                      value={siteFolder}
                      onChange={(e) => setSiteFolder(e.target.value)}
                      placeholder="e.g., Main Kitchen, Floor 2, Warehouse A"
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

              {activeTab === "text" ? (
                <div className="space-y-4">
                  {selectedTemplate ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-action-green/30 bg-action-green/5 px-3 py-2 text-xs">
                      <span className="font-medium text-ink">
                        Loaded:{" "}
                        <span className="font-semibold">
                          {selectedTemplate.title}
                        </span>{" "}
                        <span className="text-ink-muted">
                          ({selectedTemplate.category})
                        </span>
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-action-green">
                        {checklistItems.length} checklist items ready
                      </span>
                    </div>
                  ) : null}

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
                      SOP Instructions (1 step per line)
                    </label>
                    <textarea
                      id="text-body"
                      rows={5}
                      value={textBody}
                      onChange={(e) => setTextBody(e.target.value)}
                      placeholder="1. Step title: Step instruction..."
                      className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-utility-blue"
                    />
                  </div>

                  {/* Checklist Items */}
                  <div className="rounded-lg border border-border bg-canvas p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        Worker Checklist Items ({checklistItems.length})
                      </span>
                      <span className="text-[11px] text-ink-muted">
                        Tap badge to toggle required
                      </span>
                    </div>

                    {checklistItems.length > 0 ? (
                      <ul className="mt-2.5 space-y-1.5">
                        {checklistItems.map((item, idx) => (
                          <li
                            key={`${item.label}-${idx}`}
                            className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs"
                          >
                            <span className="truncate font-medium text-ink">
                              {idx + 1}. {item.label}
                            </span>
                            <div className="flex shrink-0 items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleChecklistRequired(idx)
                                }
                                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase transition-colors ${
                                  item.required
                                    ? "bg-action-green/10 text-action-green"
                                    : "bg-canvas-muted text-ink-muted"
                                }`}
                              >
                                {item.required ? "Required" : "Optional"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveChecklistItem(idx)}
                                aria-label={`Remove ${item.label}`}
                                className="rounded p-0.5 text-ink-muted hover:bg-canvas-muted hover:text-alert-red"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <div className="mt-2.5 flex gap-2">
                      <input
                        type="text"
                        value={newChecklistLabel}
                        onChange={(e) => setNewChecklistLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddChecklistItem();
                          }
                        }}
                        placeholder="Add a checklist item (e.g., Area swept & dry)"
                        className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-ink outline-none focus:border-utility-blue"
                      />
                      <button
                        type="button"
                        onClick={handleAddChecklistItem}
                        className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-canvas-muted"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Optional Location / Site Folder & Manager WhatsApp */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="text-site-folder"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                      >
                        <Folder className="h-3.5 w-3.5 text-utility-blue" />
                        Location / Site Folder
                      </label>
                      <input
                        id="text-site-folder"
                        type="text"
                        list="workbench-folder-suggestions"
                        value={siteFolder}
                        onChange={(e) => setSiteFolder(e.target.value)}
                        placeholder="e.g., Main Kitchen, Floor 2 (Optional)"
                        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-utility-blue"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="text-manager-whatsapp"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-action-green" />
                        Manager WhatsApp (Alerts)
                      </label>
                      <input
                        id="text-manager-whatsapp"
                        type="tel"
                        value={managerWhatsapp}
                        onChange={(e) => setManagerWhatsapp(e.target.value)}
                        placeholder="+91 9876543210 (Optional)"
                        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 font-mono text-sm text-ink outline-none focus:border-utility-blue"
                      />
                    </div>
                  </div>
                  <p className="-mt-2 text-[11px] text-ink-muted">
                    Workers reporting Faulty or Needs Maintenance get a 1-tap
                    WhatsApp alert pre-filled with machine, notes &amp; photo
                    proof.
                  </p>

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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="ai-site-folder"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                      >
                        <Folder className="h-3.5 w-3.5 text-utility-blue" />
                        Location / Site Folder
                      </label>
                      <input
                        id="ai-site-folder"
                        type="text"
                        list="workbench-folder-suggestions"
                        value={siteFolder}
                        onChange={(e) => setSiteFolder(e.target.value)}
                        placeholder="e.g., Main Kitchen, Floor 2 (Optional)"
                        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-ink outline-none focus:border-utility-blue"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ai-manager-whatsapp"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-action-green" />
                        Manager WhatsApp (Alerts)
                      </label>
                      <input
                        id="ai-manager-whatsapp"
                        type="tel"
                        value={managerWhatsapp}
                        onChange={(e) => setManagerWhatsapp(e.target.value)}
                        placeholder="+91 9876543210 (Optional)"
                        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2 font-mono text-sm text-ink outline-none focus:border-utility-blue"
                      />
                    </div>
                  </div>

                  {aiAuthRequired ? (
                    <div className="flex flex-col gap-3 rounded-lg border border-utility-blue/30 bg-utility-blue/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-2.5 text-xs text-ink">
                        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-utility-blue" />
                        <span>
                          Sign in for free to generate AI SOPs and save them to
                          your dashboard.
                        </span>
                      </div>
                      <Link
                        href="/login"
                        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-ink px-4 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        Sign In for Free
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ) : null}

                  {aiUpgradeMessage ? (
                    <div
                      role="alert"
                      className="flex flex-col gap-3 rounded-lg border border-alert-red/30 bg-alert-red/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-2.5 text-xs text-ink">
                        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-alert-red" />
                        <span>{aiUpgradeMessage}</span>
                      </div>
                      <Link
                        href="/pricing"
                        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-action-green px-4 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                      >
                        Upgrade to Pro
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
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

            <datalist id="workbench-folder-suggestions">
              {existingFolders.map((folder) => (
                <option key={folder} value={folder} />
              ))}
            </datalist>
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
                <p className="mt-0.5 text-xs text-ink-muted">
                  {preview.subtitle}
                </p>
                <p className="mt-1 font-mono text-xs text-ink-muted">
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

              <Link
                href={`/q/${preview.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted"
              >
                Test Worker Scan View
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 1-Click Industry Template Gallery (Below the Fold) */}
      <section id="templates" className="mt-12 border-t border-border pt-10">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-semibold text-ink sm:text-xl">
              1-Click Industry SOP Templates
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Pre-built Indian B2B &amp; compliance checklists. Populate the
              workbench in one click and generate a live QR in under 10 seconds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRY_TEMPLATES.map((template) => {
            const Icon =
              INDUSTRY_TEMPLATE_ICONS[template.id] ?? ClipboardList;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() =>
                  applyIndustryTemplate(template, { scrollToWorkbench: true })
                }
                className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 text-left transition-colors hover:border-action-green"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-canvas-muted text-ink">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded border border-border bg-canvas px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                      {template.category}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-sm font-semibold text-ink group-hover:text-action-green">
                    {template.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                    {template.description}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-ink-muted">
                    {template.steps.length} SOP steps •{" "}
                    {template.checklist.length} checks
                  </p>
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-action-green">
                  Load in Workbench
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
