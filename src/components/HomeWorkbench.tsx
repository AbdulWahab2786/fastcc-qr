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
import { useRouter, useSearchParams } from "next/navigation";
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
  Clock,
  Palette,
  LayoutGrid,
} from "lucide-react";
import { QrCodePreview } from "@/components/QrCodePreview";
import { LandingHero } from "@/components/LandingHero";
import { trackEvent } from "@/components/AnalyticsProvider";
import {
  QrBeautifyControls,
  QrLabelThemeGrid,
} from "@/components/QrLabelThemePicker";
import {
  buildSopConfigJson,
  formatTemplateStepsText,
  getIndustryTemplateById,
  INDUSTRY_TEMPLATES,
  parseSopStepsFromText,
  type IndustryTemplate,
  type IndustryTemplateStep,
} from "@/lib/industry-templates";
import { getSeoTemplateBySlug } from "@/data/seo-templates";
import {
  INSPECTION_SCHEDULE_OPTIONS,
  normalizeInspectionSchedule,
  type InspectionSchedule,
} from "@/lib/inspection-schedule";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  createGuestQrCode,
  EMPTY_FOLDER_SUGGESTIONS,
  extractUniqueFolders,
  getLocalFolderSuggestions,
  getLocalQrRecord,
  getQrScanUrl,
  saveLocalQrRecord,
  saveLocalSopSteps,
} from "@/lib/qr-utils";
import {
  downloadQrSvg,
  downloadThemedLabelPng,
} from "@/lib/qr-export";
import {
  DEFAULT_QR_DOT_STYLE,
  DEFAULT_QR_LABEL_THEME,
  DEFAULT_QR_THEME_COLOR,
  type QrDotStyle,
  type QrLabelThemeId,
  type QrThemeColorId,
} from "@/lib/qr-label-themes";
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

interface SavedQrPreview {
  id: string;
  shortCode: string;
  userId: string | null;
  title: string;
  subtitle: string;
  isLocalFallback: boolean;
  showWatermark: boolean;
  fingerprint: string;
}

function normalizeDestinationUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const subscribeNoop = () => () => {};

interface HomeWorkbenchProps {
  initialTemplateId?: string;
}

export function HomeWorkbench({ initialTemplateId }: HomeWorkbenchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seoTemplateSlug = searchParams.get("seoTemplate");
  const initialSeoTemplate = getSeoTemplateBySlug(seoTemplateSlug);
  const initialTemplate = getIndustryTemplateById(initialTemplateId);
  const [prevSeoSlug, setPrevSeoSlug] = useState<string | null>(
    () => seoTemplateSlug,
  );
  const [prevTemplateId, setPrevTemplateId] = useState<string | undefined>(
    () => initialTemplateId,
  );

  const [activeTab, setActiveTab] = useState<WorkbenchTab>(() =>
    initialTemplate || initialSeoTemplate ? "text" : "url",
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    () => initialTemplate?.id ?? null,
  );
  const [templateRefSteps, setTemplateRefSteps] = useState<
    readonly IndustryTemplateStep[]
  >(() =>
    initialSeoTemplate
      ? initialSeoTemplate.sopSteps
      : initialTemplate
        ? initialTemplate.steps
        : [],
  );

  // Standard URL & SOP/Checklist inputs
  const [urlTitle, setUrlTitle] = useState("Line B — Safety & Startup Guide");
  const [urlTarget, setUrlTarget] = useState("https://fastcc.app/sop/line-b");
  const [textTitle, setTextTitle] = useState(() =>
    initialSeoTemplate
      ? initialSeoTemplate.title
      : initialTemplate
        ? initialTemplate.title
        : "Compressor Daily Check",
  );
  const [sopCategory, setSopCategory] = useState(() =>
    initialSeoTemplate
      ? initialSeoTemplate.industry
      : initialTemplate
        ? initialTemplate.category
        : "Operations",
  );
  const [sopSummary, setSopSummary] = useState(() =>
    initialSeoTemplate
      ? initialSeoTemplate.shortDescription
      : initialTemplate
        ? initialTemplate.description
        : "",
  );
  const [textBody, setTextBody] = useState(() =>
    initialSeoTemplate
      ? formatTemplateStepsText(initialSeoTemplate.sopSteps)
      : initialTemplate
        ? formatTemplateStepsText(initialTemplate.steps)
        : "1. Check oil sight glass.\n2. Drain moisture trap.\n3. Verify 8 bar cutout.",
  );
  const [checklistItems, setChecklistItems] = useState<VideoSopChecklistItem[]>(
    () =>
      initialSeoTemplate
        ? initialSeoTemplate.checklistItems.map((item) => ({ ...item }))
        : initialTemplate
          ? initialTemplate.checklist.map((item) => ({ ...item }))
          : [],
  );

  const [newChecklistLabel, setNewChecklistLabel] = useState("");
  const [managerWhatsapp, setManagerWhatsapp] = useState("");
  const [siteFolder, setSiteFolder] = useState("");
  const [inspectionSchedule, setInspectionSchedule] =
    useState<InspectionSchedule>(() =>
      initialSeoTemplate ? initialSeoTemplate.frequency : "none",
    );
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
  const [previewMode, setPreviewMode] = useState<"label" | "qr">("label");
  const [labelTheme, setLabelTheme] = useState<QrLabelThemeId>(
    DEFAULT_QR_LABEL_THEME,
  );
  const [themeColor, setThemeColor] = useState<QrThemeColorId>(
    DEFAULT_QR_THEME_COLOR,
  );
  const [dotStyle, setDotStyle] = useState<QrDotStyle>(DEFAULT_QR_DOT_STYLE);
  const [activePreviewPanel, setActivePreviewPanel] = useState<
    "none" | "beautify" | "theme"
  >("none");
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [savedQr, setSavedQr] = useState<SavedQrPreview | null>(null);
  const [aiPreview, setAiPreview] = useState<{
    shortCode: string;
    title: string;
    subtitle: string;
    isLocalFallback: boolean;
    showWatermark: boolean;
  } | null>(null);

  if (seoTemplateSlug !== prevSeoSlug) {
    setPrevSeoSlug(seoTemplateSlug);
    const matched = getSeoTemplateBySlug(seoTemplateSlug);
    if (matched) {
      setSelectedTemplateId(null);
      setTemplateRefSteps(matched.sopSteps);
      setActiveTab("text");
      setTextTitle(matched.title);
      setSopCategory(matched.industry);
      setSopSummary(matched.shortDescription);
      setTextBody(formatTemplateStepsText(matched.sopSteps));
      setChecklistItems(matched.checklistItems.map((item) => ({ ...item })));
      setInspectionSchedule(matched.frequency);
      setSavedQr(null);
      setBannerNotice(null);
      setQrUpgradeMessage(null);
    }
  }

  if (initialTemplateId !== prevTemplateId) {
    setPrevTemplateId(initialTemplateId);
    const matched = getIndustryTemplateById(initialTemplateId);
    if (matched) {
      setSelectedTemplateId(matched.id);
      setTemplateRefSteps(matched.steps);
      setActiveTab("text");
      setTextTitle(matched.title);
      setSopCategory(matched.category);
      setSopSummary(matched.description);
      setTextBody(formatTemplateStepsText(matched.steps));
      setChecklistItems(matched.checklist.map((item) => ({ ...item })));
      setSavedQr(null);
      setBannerNotice(null);
      setQrUpgradeMessage(null);
    }
  }

  const selectedTemplate = getIndustryTemplateById(selectedTemplateId);

  const normalizedUrlTarget = useMemo(
    () => normalizeDestinationUrl(urlTarget),
    [urlTarget],
  );

  const parsedTextSteps = useMemo(
    () => parseSopStepsFromText(textBody, templateRefSteps),
    [textBody, templateRefSteps],
  );

  const currentFingerprint = useMemo(() => {
    if (activeTab === "url") {
      return JSON.stringify({
        tab: "url",
        title: urlTitle.trim(),
        target: normalizedUrlTarget,
        folder: siteFolder.trim(),
        schedule: inspectionSchedule,
      });
    }
    return JSON.stringify({
      tab: "text",
      title: textTitle.trim(),
      category: sopCategory,
      summary: sopSummary.trim(),
      body: textBody,
      checklist: checklistItems,
      folder: siteFolder.trim(),
      schedule: inspectionSchedule,
      whatsapp: managerWhatsapp.trim(),
    });
  }, [
    activeTab,
    urlTitle,
    normalizedUrlTarget,
    textTitle,
    sopCategory,
    sopSummary,
    textBody,
    checklistItems,
    siteFolder,
    inspectionSchedule,
    managerWhatsapp,
  ]);

  const isAiTab = activeTab === "video" || activeTab === "paper";
  const currentSavedQr =
    !isAiTab && savedQr !== null && savedQr.fingerprint === currentFingerprint
      ? savedQr
      : null;
  const isSavedCurrent = isAiTab ? aiPreview !== null : currentSavedQr !== null;

  const activeShortCode = isAiTab
    ? (aiPreview?.shortCode ?? "demo")
    : currentSavedQr
      ? currentSavedQr.shortCode
      : "";

  const scanUrl = activeShortCode
    ? getQrScanUrl(activeShortCode)
    : getQrScanUrl("draft");

  const livePreviewTitle = isAiTab
    ? (aiPreview?.title ?? "D2C Packing Station #04")
    : currentSavedQr
      ? currentSavedQr.title
      : activeTab === "url"
        ? urlTitle.trim() || "Untitled URL QR"
        : textTitle.trim() || "Untitled Operations SOP";

  const livePreviewSubtitle = isAiTab
    ? (aiPreview?.subtitle ?? "Scan for Hindi/English Steps")
    : currentSavedQr
      ? currentSavedQr.subtitle
      : activeTab === "url"
        ? normalizedUrlTarget.slice(0, 48) || "Scan to open operational link"
        : parsedTextSteps.length > 0 || checklistItems.length > 0
          ? `${parsedTextSteps.length} SOP ${parsedTextSteps.length === 1 ? "step" : "steps"} • ${checklistItems.length} ${checklistItems.length === 1 ? "check" : "checks"}`
          : "Scan for SOP & Logs";

  const liveScheduleLabel =
    inspectionSchedule !== "none"
      ? (INSPECTION_SCHEDULE_OPTIONS.find(
          (option) => option.value === inspectionSchedule,
        )?.label ?? "")
      : "";

  async function syncSavedThemeConfig(
    nextTheme: QrLabelThemeId,
    nextColor: QrThemeColorId,
    nextDotStyle: QrDotStyle,
  ) {
    if (!isSavedCurrent || !savedQr) return;
    const isUrlTab = activeTab === "url";
    const trimmedWhatsapp = managerWhatsapp.trim();
    const rawFolder = siteFolder.trim();
    const normalizedFolder =
      rawFolder && rawFolder.toLowerCase() !== "unassigned" ? rawFolder : "";

    const updatedConfig: Json = isUrlTab
      ? ({
          label_theme: nextTheme,
          theme_color: nextColor,
          ...(nextDotStyle !== "square" ? { dot_style: nextDotStyle } : {}),
          ...(normalizedFolder ? { folder: normalizedFolder } : {}),
          ...(inspectionSchedule !== "none"
            ? { inspection_schedule: inspectionSchedule }
            : {}),
        } as Json)
      : buildSopConfigJson({
          summary: sopSummary.trim() || undefined,
          checklist: checklistItems,
          managerWhatsapp: trimmedWhatsapp,
          folder: normalizedFolder,
          inspectionSchedule,
          labelTheme: nextTheme,
          themeColor: nextColor,
          dotStyle: nextDotStyle,
        });

    const localExisting = getLocalQrRecord(savedQr.shortCode);
    if (localExisting) {
      saveLocalQrRecord({
        ...localExisting,
        config_json: updatedConfig,
        updated_at: new Date().toISOString(),
      });
    }

    if (hasSupabaseEnv() && savedQr.userId && !savedQr.isLocalFallback) {
      try {
        const supabase = createClient();
        await supabase
          .from("qr_codes")
          .update({ config_json: updatedConfig })
          .eq("id", savedQr.id)
          .eq("user_id", savedQr.userId);
      } catch {
        // Non-blocking theme sync failure.
      }
    }
  }

  async function ensureSavedQr(): Promise<SavedQrPreview | null> {
    if (isSavedCurrent && savedQr) {
      return savedQr;
    }

    setIsSubmitting(true);
    setBannerNotice(null);
    setQrUpgradeMessage(null);

    try {
      const isUrlTab = activeTab === "url";
      const parsedSteps = isUrlTab ? [] : parsedTextSteps;
      const isSopMode =
        !isUrlTab &&
        (checklistItems.length > 0 ||
          parsedSteps.length > 0 ||
          Boolean(managerWhatsapp.trim()));

      const title = isUrlTab ? urlTitle : textTitle;
      const trimmedSummary = sopSummary.trim();
      const description = isUrlTab
        ? normalizedUrlTarget
        : isSopMode
          ? trimmedSummary ||
            `${parsedSteps.length} SOP ${parsedSteps.length === 1 ? "step" : "steps"}${checklistItems.length > 0 ? ` • ${checklistItems.length} ${checklistItems.length === 1 ? "check" : "checks"}` : ""}`
          : textBody;
      const category = isUrlTab ? "url" : isSopMode ? sopCategory : "text";
      const trimmedWhatsapp = managerWhatsapp.trim();
      const rawFolder = siteFolder.trim();
      const normalizedFolder =
        rawFolder && rawFolder.toLowerCase() !== "unassigned" ? rawFolder : "";

      const urlConfigObj: Record<string, Json> = {
        label_theme: labelTheme,
        theme_color: themeColor,
      };
      if (dotStyle !== "square") {
        urlConfigObj.dot_style = dotStyle;
      }
      if (normalizedFolder) {
        urlConfigObj.folder = normalizedFolder;
      }
      if (inspectionSchedule !== "none") {
        urlConfigObj.inspection_schedule = inspectionSchedule;
      }

      const configJson: Json | undefined = isUrlTab
        ? (urlConfigObj as Json)
        : buildSopConfigJson({
            summary: trimmedSummary || undefined,
            checklist: checklistItems,
            managerWhatsapp: trimmedWhatsapp,
            folder: normalizedFolder,
            inspectionSchedule,
            labelTheme,
            themeColor,
            dotStyle,
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
        return null;
      }

      if (normalizedFolder) {
        setCreatedFolders((prev) =>
          prev.includes(normalizedFolder) ? prev : [...prev, normalizedFolder],
        );
      }

      const nextSaved: SavedQrPreview = {
        id: result.record.id,
        shortCode: result.record.short_code,
        userId: result.record.user_id,
        title: result.record.title,
        subtitle: isSopMode
          ? `${parsedSteps.length} SOP ${parsedSteps.length === 1 ? "step" : "steps"} • ${checklistItems.length} ${checklistItems.length === 1 ? "check" : "checks"}`
          : result.record.description
            ? result.record.description.slice(0, 64)
            : "Scan for instructions",
        isLocalFallback: result.isLocalFallback,
        showWatermark: result.record.show_watermark,
        fingerprint: currentFingerprint,
      };

      setSavedQr(nextSaved);
      trackEvent("qr_generated", {
        source: "workbench",
        type: result.record.type,
        isLocalFallback: result.isLocalFallback,
      });

      if (result.isLocalFallback && result.notice) {
        setBannerNotice(result.notice);
      }

      return nextSaved;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDownloadPreviewPng() {
    setIsDownloadingPng(true);
    try {
      let targetShortCode = activeShortCode;
      let targetScanUrl = scanUrl;
      let targetTitle = livePreviewTitle;
      let targetSubtitle = livePreviewSubtitle;

      if (!isAiTab && !isSavedCurrent) {
        const saved = await ensureSavedQr();
        if (!saved) return;
        targetShortCode = saved.shortCode;
        targetScanUrl = getQrScanUrl(saved.shortCode);
        targetTitle = saved.title;
        targetSubtitle = saved.subtitle;
      }

      const effectiveTheme: QrLabelThemeId =
        previewMode === "qr" ? "classic" : labelTheme;
      const suffix =
        effectiveTheme === "classic" ? "" : `-${effectiveTheme}`;
      await downloadThemedLabelPng(
        {
          qrUrl: targetScanUrl,
          shortCode: targetShortCode,
          title: targetTitle,
          subtitle: targetSubtitle,
          folder: siteFolder.trim(),
          scheduleLabel: liveScheduleLabel,
          theme: effectiveTheme,
          themeColor,
          dotStyle,
          showWatermark: false,
        },
        `fastcc-${targetShortCode}${suffix}.png`,
      );
    } finally {
      setIsDownloadingPng(false);
    }
  }

  async function handleDownloadPreviewSvg() {
    let targetShortCode = activeShortCode;
    let targetScanUrl = scanUrl;

    if (!isAiTab && !isSavedCurrent) {
      const saved = await ensureSavedQr();
      if (!saved) return;
      targetShortCode = saved.shortCode;
      targetScanUrl = getQrScanUrl(saved.shortCode);
    }

    await downloadQrSvg(targetScanUrl, `fastcc-${targetShortCode}.svg`);
  }

  async function handleOpenStudio() {
    if (!isAiTab && !isSavedCurrent) {
      const saved = await ensureSavedQr();
      if (!saved) return;
      router.push(`/studio/${saved.shortCode}`);
      return;
    }
    router.push(`/studio/${activeShortCode}`);
  }

  async function handleOpenWorkerScan() {
    if (!isAiTab && !isSavedCurrent) {
      const popup =
        typeof window !== "undefined"
          ? window.open("about:blank", "_blank")
          : null;
      const saved = await ensureSavedQr();
      if (!saved) {
        popup?.close();
        return;
      }
      const targetUrl = getQrScanUrl(saved.shortCode);
      if (popup) {
        popup.opener = null;
        popup.location.assign(targetUrl);
      } else {
        router.push(`/q/${saved.shortCode}`);
      }
      return;
    }
    if (typeof window !== "undefined") {
      window.open(`/q/${activeShortCode}`, "_blank", "noopener,noreferrer");
    }
  }

  function applyIndustryTemplate(
    template: IndustryTemplate,
    options?: { scrollToWorkbench?: boolean },
  ) {
    setSelectedTemplateId(template.id);
    setTemplateRefSteps(template.steps);
    setActiveTab("text");
    setTextTitle(template.title);
    setSopCategory(template.category);
    setSopSummary(template.description);
    setTextBody(formatTemplateStepsText(template.steps));
    setChecklistItems(template.checklist.map((item) => ({ ...item })));
    setSavedQr(null);
    setQrUpgradeMessage(null);
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
    setSelectedTemplateId(null);
    setSavedQr(null);
    setChecklistItems((prev) => [...prev, { label: trimmed, required: true }]);
    setNewChecklistLabel("");
  }

  function handleRemoveChecklistItem(index: number) {
    setSelectedTemplateId(null);
    setSavedQr(null);
    setChecklistItems((prev) => prev.filter((_, idx) => idx !== index));
  }

  function handleToggleChecklistRequired(index: number) {
    setSelectedTemplateId(null);
    setSavedQr(null);
    setChecklistItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, required: !item.required } : item,
      ),
    );
  }

  async function handleGeneratePermanentQr() {
    await ensureSavedQr();
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
    if (inspectionSchedule !== "none") {
      formData.append("inspection_schedule", inspectionSchedule);
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
            label_theme: labelTheme,
            theme_color: themeColor,
            ...(dotStyle !== "square" ? { dot_style: dotStyle } : {}),
            ...(trimmedWhatsapp ? { manager_whatsapp: trimmedWhatsapp } : {}),
            ...(normalizedFolder ? { folder: normalizedFolder } : {}),
            ...(inspectionSchedule !== "none"
              ? { inspection_schedule: inspectionSchedule }
              : {}),
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

        setAiPreview({
          shortCode: videoResult.short_code,
          title: videoResult.title,
          subtitle: `${videoResult.steps.length} SOP steps • ${aiLanguage}`,
          isLocalFallback: Boolean(videoResult.isLocalFallback),
          showWatermark: Boolean(videoResult.show_watermark ?? true),
        });
        trackEvent("qr_generated", {
          source: "ai_video_sop",
          type: "sop",
          isLocalFallback: Boolean(videoResult.isLocalFallback),
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
            label_theme: labelTheme,
            theme_color: themeColor,
            ...(dotStyle !== "square" ? { dot_style: dotStyle } : {}),
            ...(trimmedWhatsapp ? { manager_whatsapp: trimmedWhatsapp } : {}),
            ...(normalizedFolder ? { folder: normalizedFolder } : {}),
            ...(inspectionSchedule !== "none"
              ? { inspection_schedule: inspectionSchedule }
              : {}),
          } as unknown as Json,
          show_watermark: Boolean(paperResult.show_watermark ?? true),
          scan_count: 0,
          last_scanned_at: null,
          current_status: "ok",
          last_inspected_at: null,
          created_at: now,
          updated_at: now,
        });

        setAiPreview({
          shortCode: paperResult.short_code,
          title: paperResult.title,
          subtitle: `${paperResult.fields.length} form fields • ${aiLanguage}`,
          isLocalFallback: Boolean(paperResult.isLocalFallback),
          showWatermark: Boolean(paperResult.show_watermark ?? true),
        });
        trackEvent("qr_generated", {
          source: "ai_paper_form",
          type: "paper_form",
          isLocalFallback: Boolean(paperResult.isLocalFallback),
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
    <div>
      {/* Hero Section with Pure-White Dot-Grid Background */}
      <div
        className="border-b border-neutral-200/70 bg-white"
        style={{
          backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
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
            <LandingHero />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Industry Template Picker + Tabbed Input */}
          <div className="rounded-xl border border-border bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.03)] lg:col-span-7">
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
                      onChange={(e) => {
                        setUrlTitle(e.target.value);
                        setSavedQr(null);
                      }}
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
                      onChange={(e) => {
                        setUrlTarget(e.target.value);
                        setSavedQr(null);
                      }}
                      placeholder="https://..."
                      className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 font-mono text-sm text-ink outline-none focus:border-utility-blue"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        onChange={(e) => {
                          setSiteFolder(e.target.value);
                          setSavedQr(null);
                        }}
                        placeholder="e.g., Main Kitchen, Floor 2, Warehouse A"
                        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-utility-blue"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="url-inspection-schedule"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                      >
                        <Clock className="h-3.5 w-3.5 text-utility-blue" />
                        Inspection Schedule
                      </label>
                      <select
                        id="url-inspection-schedule"
                        value={inspectionSchedule}
                        onChange={(e) => {
                          setInspectionSchedule(
                            normalizeInspectionSchedule(e.target.value),
                          );
                          setSavedQr(null);
                        }}
                        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-utility-blue"
                      >
                        {INSPECTION_SCHEDULE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
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
                      onChange={(e) => {
                        setTextTitle(e.target.value);
                        setSelectedTemplateId(null);
                        setSopSummary("");
                        setSavedQr(null);
                      }}
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
                      onChange={(e) => {
                        setTextBody(e.target.value);
                        setSelectedTemplateId(null);
                        setSopSummary("");
                        setSavedQr(null);
                      }}
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

                  {/* Optional Location / Site Folder, Schedule & Manager WhatsApp */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                        onChange={(e) => {
                          setSiteFolder(e.target.value);
                          setSavedQr(null);
                        }}
                        placeholder="e.g., Main Kitchen (Optional)"
                        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-utility-blue"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="text-inspection-schedule"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                      >
                        <Clock className="h-3.5 w-3.5 text-utility-blue" />
                        Inspection Schedule
                      </label>
                      <select
                        id="text-inspection-schedule"
                        value={inspectionSchedule}
                        onChange={(e) => {
                          setInspectionSchedule(
                            normalizeInspectionSchedule(e.target.value),
                          );
                          setSavedQr(null);
                        }}
                        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-utility-blue"
                      >
                        {INSPECTION_SCHEDULE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
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
                        onChange={(e) => {
                          setManagerWhatsapp(e.target.value);
                          setSavedQr(null);
                        }}
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                        onChange={(e) => {
                          setSiteFolder(e.target.value);
                          setSavedQr(null);
                        }}
                        placeholder="e.g., Main Kitchen (Optional)"
                        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-ink outline-none focus:border-utility-blue"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ai-inspection-schedule"
                        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted"
                      >
                        <Clock className="h-3.5 w-3.5 text-utility-blue" />
                        Inspection Schedule
                      </label>
                      <select
                        id="ai-inspection-schedule"
                        value={inspectionSchedule}
                        onChange={(e) => {
                          setInspectionSchedule(
                            normalizeInspectionSchedule(e.target.value),
                          );
                          setSavedQr(null);
                        }}
                        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-ink outline-none focus:border-utility-blue"
                      >
                        {INSPECTION_SCHEDULE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
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
                        onChange={(e) => {
                          setManagerWhatsapp(e.target.value);
                          setSavedQr(null);
                        }}
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
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] lg:sticky lg:top-20 lg:col-span-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div
                role="tablist"
                aria-label="QR Preview Mode"
                className="inline-flex rounded-lg border border-border bg-canvas-muted p-0.5"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={previewMode === "label"}
                  onClick={() => setPreviewMode("label")}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    previewMode === "label"
                      ? "bg-surface text-ink shadow-2xs"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  Label Preview
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={previewMode === "qr"}
                  onClick={() => setPreviewMode("qr")}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    previewMode === "qr"
                      ? "bg-surface text-ink shadow-2xs"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  QR Code
                </button>
              </div>

              {isSavedCurrent ? (
                <span className="inline-flex items-center gap-1 rounded border border-action-green/30 bg-action-green/10 px-2 py-0.5 font-mono text-xs font-semibold text-action-green">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {activeShortCode}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-amber-700">
                  Unsaved Draft
                </span>
              )}
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-canvas p-4 text-center">
              <div className="relative inline-flex max-w-full items-center justify-center">
                {previewMode === "qr" ? (
                  <QrCodePreview
                    value={scanUrl}
                    size={196}
                    theme="classic"
                    dotStyle={dotStyle}
                  />
                ) : (
                  <QrCodePreview
                    value={scanUrl}
                    size={180}
                    theme={labelTheme}
                    themeColor={themeColor}
                    dotStyle={dotStyle}
                    title={livePreviewTitle}
                    subtitle={livePreviewSubtitle}
                    folder={siteFolder.trim()}
                    shortCode={activeShortCode || "DRAFT"}
                    scheduleLabel={liveScheduleLabel}
                  />
                )}

                {!isSavedCurrent && !isAiTab ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/75 px-4 backdrop-blur-[2px]">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleGeneratePermanentQr}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-action-green px-3.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Live QR
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                    <span className="mt-1.5 text-[11px] font-medium text-ink-muted">
                      Saves edits &amp; activates scan link
                    </span>
                  </div>
                ) : null}
              </div>

              {previewMode === "qr" || labelTheme === "classic" ? (
                <>
                  <p className="mt-2.5 text-sm font-semibold text-ink">
                    {livePreviewTitle}
                  </p>
                  <p className="mt-0.5 max-w-full truncate text-xs text-ink-muted">
                    {livePreviewSubtitle}
                  </p>
                </>
              ) : null}

              <p className="mt-1.5 font-mono text-[11px] text-ink-muted">
                {isSavedCurrent
                  ? `/q/${activeShortCode}`
                  : "Click Generate Permanent QR to lock link"}
              </p>
            </div>

            {/* Minimal 3-Button Customize / Download Bar */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                aria-expanded={activePreviewPanel === "beautify"}
                onClick={() =>
                  setActivePreviewPanel((prev) =>
                    prev === "beautify" ? "none" : "beautify",
                  )
                }
                className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors ${
                  activePreviewPanel === "beautify"
                    ? "border-ink bg-canvas-muted text-ink"
                    : "border-border bg-surface text-ink hover:bg-canvas-muted"
                }`}
              >
                <Palette className="h-3.5 w-3.5 text-utility-blue" />
                Beautify
              </button>
              <button
                type="button"
                aria-expanded={activePreviewPanel === "theme"}
                onClick={() =>
                  setActivePreviewPanel((prev) =>
                    prev === "theme" ? "none" : "theme",
                  )
                }
                className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors ${
                  activePreviewPanel === "theme"
                    ? "border-utility-blue bg-utility-blue/5 text-ink"
                    : "border-border bg-surface text-ink hover:bg-canvas-muted"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5 text-utility-blue" />
                Label Theme
              </button>
              <button
                type="button"
                disabled={isDownloadingPng || isSubmitting}
                onClick={handleDownloadPreviewPng}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted disabled:opacity-60"
              >
                <Download className="h-3.5 w-3.5 text-action-green" />
                {isDownloadingPng ? "Saving..." : "Download"}
              </button>
            </div>

            {activePreviewPanel === "beautify" ? (
              <div className="rounded-xl border border-border bg-canvas p-3">
                <QrBeautifyControls
                  themeColor={themeColor}
                  dotStyle={dotStyle}
                  onSelectColor={(color) => {
                    setThemeColor(color);
                    void syncSavedThemeConfig(labelTheme, color, dotStyle);
                  }}
                  onSelectDotStyle={(style) => {
                    setDotStyle(style);
                    void syncSavedThemeConfig(labelTheme, themeColor, style);
                  }}
                />
              </div>
            ) : null}

            {activePreviewPanel === "theme" ? (
              <div className="rounded-xl border border-border bg-canvas p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  Choose Print Label Theme (Free for All Users)
                </p>
                <QrLabelThemeGrid
                  selectedTheme={labelTheme}
                  themeColor={themeColor}
                  onSelectTheme={(theme) => {
                    setLabelTheme(theme);
                    setPreviewMode("label");
                    void syncSavedThemeConfig(theme, themeColor, dotStyle);
                  }}
                />
              </div>
            ) : null}

            <div className="space-y-2 border-t border-border pt-3">
              {isSavedCurrent ? (
                <Link
                  href={`/studio/${activeShortCode}`}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-utility-blue px-4 text-sm font-semibold text-white transition-opacity hover:opacity-95"
                >
                  Open Label Studio
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleOpenStudio}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-utility-blue px-4 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                >
                  Open Label Studio
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDownloadPreviewSvg}
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5 text-utility-blue" />
                  Download Vector SVG
                </button>

                {isSavedCurrent ? (
                  <Link
                    href={`/q/${activeShortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted"
                  >
                    Test Worker Scan View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleOpenWorkerScan}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted disabled:opacity-60"
                  >
                    Test Worker Scan View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>
      </div>

      {/* 1-Click Industry Template Gallery (Below the Fold) */}
      <section id="templates" className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pb-14 sm:pt-16">
        <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              1-Click Industry SOP Templates
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted">
              Load a pre-built Indian compliance checklist and generate a live QR
              in seconds.
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
    </div>
  );
}
