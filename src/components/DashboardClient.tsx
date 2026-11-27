"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Flame,
  Folder,
  Loader2,
  Lock,
  Plus,
  Printer,
  QrCode,
  ScanLine,
  Sparkles,
  Trash2,
  Truck,
  Utensils,
  X,
  Zap,
} from "lucide-react";
import { BulkImportModal } from "@/components/BulkImportModal";
import { BulkPrintModal } from "@/components/BulkPrintModal";
import {
  AUDIT_DATE_RANGE_OPTIONS,
  exportAuditReportCsv,
  exportAuditReportPdf,
  extractSignatureDataUrl,
  filterLogsByDateRange,
  getAuditDateRangeLabel,
  resolveLogEquipmentStatus,
  type AuditDateRange,
} from "@/lib/audit-report-export";
import {
  canExportCsv,
  canUseA4BulkPrint,
  FREE_QR_LIMIT,
  getAiSopLimit,
  isPaidPlan,
  PLAN_SPECS,
} from "@/lib/billing/constants";
import {
  buildSopConfigJson,
  INDUSTRY_TEMPLATES,
  type IndustryTemplate,
} from "@/lib/industry-templates";
import { getScheduleStatus } from "@/lib/inspection-schedule";
import { createClient } from "@/lib/supabase/client";
import {
  createGuestQrCode,
  getQrFolder,
  getQrScanUrl,
  UNASSIGNED_FOLDER,
} from "@/lib/qr-utils";
import type { EquipmentStatus, PlanTier } from "@/types/database";
import type { InspectionLogRow, QrCodeRow } from "@/types/qr";

interface DashboardClientProps {
  userEmail: string;
  initialQrCodes: QrCodeRow[];
  initialLogs: InspectionLogRow[];
  plan: PlanTier;
  aiSopsUsed: number;
  planExpiresAt: string | null;
  justUpgraded: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  url: "url",
  video_sop: "video_sop",
  paper_form: "paper_form",
  sop: "sop",
  standard: "standard",
};

const TEMPLATE_ICONS: Record<string, typeof Utensils> = {
  "fssai-kitchen-cleaning": Utensils,
  "dg-set-daily-check": Zap,
  "fire-extinguisher-audit": Flame,
  "warehouse-forklift-check": Truck,
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  if (status === "faulty") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-alert-red/30 bg-alert-red/10 px-2 py-0.5 font-mono text-xs font-semibold uppercase text-alert-red">
        <span className="h-1.5 w-1.5 rounded-full bg-alert-red" />
        Faulty
      </span>
    );
  }

  if (status === "maintenance") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-semibold uppercase text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Maintenance
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-action-green/30 bg-action-green/10 px-2 py-0.5 font-mono text-xs font-semibold uppercase text-action-green">
      <span className="h-1.5 w-1.5 rounded-full bg-action-green" />
      OK
    </span>
  );
}

function TypeBadge({ type, category }: { type: string; category: string }) {
  const resolvedType =
    type === "standard" && category === "url"
      ? "url"
      : (TYPE_LABELS[type] ?? type);
  const isAi = resolvedType === "video_sop" || resolvedType === "paper_form";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-medium ${
        isAi
          ? "border-utility-blue/30 bg-utility-blue/10 text-utility-blue"
          : "border-border bg-canvas-muted text-ink-muted"
      }`}
    >
      {resolvedType}
    </span>
  );
}

export function DashboardClient({
  userEmail,
  initialQrCodes,
  initialLogs,
  plan,
  aiSopsUsed,
  planExpiresAt,
  justUpgraded,
}: DashboardClientProps) {
  const router = useRouter();
  const [qrCodes, setQrCodes] = useState<QrCodeRow[]>(initialQrCodes);
  const [logs, setLogs] = useState<InspectionLogRow[]>(initialLogs);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [csvUpgradePrompt, setCsvUpgradePrompt] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | EquipmentStatus | "overdue"
  >("all");
  const [nowMs] = useState<number>(() => Date.now());
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [isBulkPrintOpen, setIsBulkPrintOpen] = useState(false);
  const [bulkPrintUpgradePrompt, setBulkPrintUpgradePrompt] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [launchingTemplateId, setLaunchingTemplateId] = useState<string | null>(
    null,
  );
  const [templateUpgradePrompt, setTemplateUpgradePrompt] = useState<
    string | null
  >(null);
  const [auditDateRange, setAuditDateRange] = useState<AuditDateRange>("all");
  const [exportingAuditKey, setExportingAuditKey] = useState<string | null>(
    null,
  );
  const [auditToast, setAuditToast] = useState<{
    message: string;
    tone: "info" | "error";
  } | null>(null);
  const [previewSignature, setPreviewSignature] = useState<{
    url: string;
    workerName: string;
    submittedAt: string;
  } | null>(null);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const fetchedLogsByQrRef = useRef<Map<string, InspectionLogRow[]>>(new Map());
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPaid = isPaidPlan(plan);
  const allowA4Print = canUseA4BulkPrint(plan);
  const allowCsvExport = canExportCsv(plan);
  const planSpec = PLAN_SPECS[plan];
  const aiLimit = getAiSopLimit(plan);

  const qrLookup = useMemo(() => {
    const map = new Map<string, QrCodeRow>();
    for (const qr of qrCodes) {
      map.set(qr.id, qr);
    }
    return map;
  }, [qrCodes]);

  const activeAiCount = useMemo(
    () =>
      qrCodes.filter(
        (qr) => qr.type === "video_sop" || qr.type === "paper_form",
      ).length,
    [qrCodes],
  );

  const totalScans = useMemo(
    () => qrCodes.reduce((sum, qr) => sum + (qr.scan_count ?? 0), 0),
    [qrCodes],
  );

  const folderOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const qr of qrCodes) {
      const folder = getQrFolder(qr);
      counts.set(folder, (counts.get(folder) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort(([a], [b]) => {
        if (a === UNASSIGNED_FOLDER) return 1;
        if (b === UNASSIGNED_FOLDER) return -1;
        return a.localeCompare(b, undefined, { sensitivity: "base" });
      })
      .map(([name, count]) => ({ name, count }));
  }, [qrCodes]);

  const folderFilteredQrCodes = useMemo(() => {
    if (folderFilter === "all") return qrCodes;
    return qrCodes.filter((qr) => getQrFolder(qr) === folderFilter);
  }, [qrCodes, folderFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<"all" | EquipmentStatus | "overdue", number> = {
      all: folderFilteredQrCodes.length,
      faulty: 0,
      maintenance: 0,
      ok: 0,
      overdue: 0,
    };
    for (const qr of folderFilteredQrCodes) {
      const status = qr.current_status ?? "ok";
      counts[status] += 1;
      if (getScheduleStatus(qr, nowMs).isOverdue) {
        counts.overdue += 1;
      }
    }
    return counts;
  }, [folderFilteredQrCodes, nowMs]);

  const filteredQrCodes = useMemo(() => {
    if (statusFilter === "all") return folderFilteredQrCodes;
    if (statusFilter === "overdue") {
      return folderFilteredQrCodes.filter(
        (qr) => getScheduleStatus(qr, nowMs).isOverdue,
      );
    }
    return folderFilteredQrCodes.filter(
      (qr) => (qr.current_status ?? "ok") === statusFilter,
    );
  }, [folderFilteredQrCodes, statusFilter, nowMs]);

  const visibleQrIds = useMemo(
    () => filteredQrCodes.map((qr) => qr.id),
    [filteredQrCodes],
  );

  const allVisibleSelected =
    visibleQrIds.length > 0 &&
    visibleQrIds.every((id) => selectedIds.has(id));

  const someVisibleSelected =
    visibleQrIds.some((id) => selectedIds.has(id)) && !allVisibleSelected;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  const selectedQrs = useMemo(
    () => filteredQrCodes.filter((qr) => selectedIds.has(qr.id)),
    [filteredQrCodes, selectedIds],
  );

  function handleToggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        for (const id of visibleQrIds) {
          next.delete(id);
        }
      } else {
        for (const id of visibleQrIds) {
          next.add(id);
        }
      }
      return next;
    });
  }

  function handleToggleSelectOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleClearSelection() {
    setSelectedIds(new Set());
  }

  function handleBulkImported(importedQrs: QrCodeRow[]) {
    if (importedQrs.length === 0) return;
    setQrCodes((prev) => {
      const existingIds = new Set(prev.map((qr) => qr.id));
      const fresh = importedQrs.filter((qr) => !existingIds.has(qr.id));
      return [...fresh.slice().reverse(), ...prev];
    });
    router.refresh();
  }

  async function handleQuickLaunchTemplate(template: IndustryTemplate) {
    setErrorBanner(null);
    setTemplateUpgradePrompt(null);
    setLaunchingTemplateId(template.id);

    try {
      const result = await createGuestQrCode({
        title: template.title,
        description: template.description,
        category: template.category,
        type: "sop",
        configJson: buildSopConfigJson({
          summary: template.description,
          checklist: template.checklist,
        }),
        steps: template.steps,
      });

      if (result.blockedByPlanLimit || !result.record) {
        setTemplateUpgradePrompt(
          result.notice ||
            "Free plan limit reached (10/10 QR codes). Upgrade to Pro for unlimited QR codes.",
        );
        return;
      }

      router.push(`/studio/${result.record.short_code}`);
    } catch {
      setErrorBanner(
        `Unexpected error creating "${template.title}" template QR.`,
      );
    } finally {
      setLaunchingTemplateId(null);
    }
  }

  async function handleCopyLink(shortCode: string) {
    const url = getQrScanUrl(shortCode);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(shortCode);
      setTimeout(() => {
        setCopiedCode((current) => (current === shortCode ? null : current));
      }, 2000);
    } catch {
      setErrorBanner("Could not copy link to clipboard.");
    }
  }

  async function handleDeleteQr(qr: QrCodeRow) {
    setErrorBanner(null);
    setDeletingId(qr.id);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("qr_codes")
        .delete()
        .eq("id", qr.id);

      if (error) {
        setErrorBanner(`Failed to delete "${qr.title}": ${error.message}`);
        return;
      }

      setQrCodes((prev) => prev.filter((item) => item.id !== qr.id));
      setLogs((prev) => prev.filter((log) => log.qr_code_id !== qr.id));
      fetchedLogsByQrRef.current.delete(qr.id);
      setSelectedIds((prev) => {
        if (!prev.has(qr.id)) return prev;
        const next = new Set(prev);
        next.delete(qr.id);
        return next;
      });
      router.refresh();
    } catch {
      setErrorBanner(`Unexpected error deleting "${qr.title}".`);
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function showAuditToast(
    message: string,
    tone: "info" | "error" = "info",
  ) {
    setAuditToast({ message, tone });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setAuditToast(null);
    }, 4500);
  }

  async function fetchLogsForQr(qrId: string): Promise<InspectionLogRow[]> {
    const cached = fetchedLogsByQrRef.current.get(qrId);
    if (cached) return cached;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("inspection_logs")
        .select("*")
        .eq("qr_code_id", qrId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        fetchedLogsByQrRef.current.set(qrId, data);
        return data;
      }
    } catch {
      // Fall back to already-loaded dashboard logs below.
    }

    return logs.filter((log) => log.qr_code_id === qrId);
  }

  async function handleAuditExport(qr: QrCodeRow, format: "pdf" | "csv") {
    if (format === "csv" && !allowCsvExport) {
      setCsvUpgradePrompt(true);
      setTemplateUpgradePrompt(
        "CSV Inspection Log export is available on Pro (₹999/mo) and Business plans.",
      );
      return;
    }

    const key = `${qr.id}:${format}`;
    setExportingAuditKey(key);
    setAuditToast(null);

    try {
      const allQrLogs = await fetchLogsForQr(qr.id);
      const filtered = filterLogsByDateRange(allQrLogs, auditDateRange);
      const rangeOptionLabel =
        AUDIT_DATE_RANGE_OPTIONS.find((opt) => opt.id === auditDateRange)
          ?.label ?? "All Time";

      if (filtered.length === 0) {
        showAuditToast(
          `No inspection logs found for "${qr.title}" (${rangeOptionLabel}).`,
          "info",
        );
        return;
      }

      if (format === "pdf") {
        exportAuditReportPdf(qr, filtered, plan, {
          dateRangeLabel: getAuditDateRangeLabel(auditDateRange, filtered),
        });
      } else {
        exportAuditReportCsv(qr, filtered);
      }
    } catch {
      showAuditToast(
        `Could not export ${format.toUpperCase()} audit report for "${qr.title}".`,
        "error",
      );
    } finally {
      setExportingAuditKey(null);
    }
  }

  function handleExportCsv() {
    if (!isPaid) {
      setCsvUpgradePrompt(true);
      return;
    }

    if (logs.length === 0) return;

    const header = [
      "Worker Name",
      "QR Title",
      "Short Code",
      "Status",
      "Notes",
      "Photo URL",
      "Submitted At",
    ];

    const rows = logs.map((log) => {
      const qr = qrLookup.get(log.qr_code_id);
      return [
        log.inspector_name,
        qr?.title ?? "Deleted QR",
        qr?.short_code ?? "",
        log.status,
        log.notes ?? "",
        log.photo_url ?? "",
        log.created_at,
      ]
        .map((cell) => escapeCsvCell(String(cell)))
        .join(",");
    });

    const csvContent = [header.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `fastcc-inspection-logs-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <main
      className={`mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 ${
        selectedQrs.length > 0 ? "pb-24 sm:pb-24" : ""
      }`}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-border bg-canvas-muted px-2 py-0.5 font-mono text-[11px] font-medium text-ink-muted">
              MANAGER CONSOLE
            </span>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase ${
                isPaid
                  ? "border-action-green/30 bg-action-green/10 text-action-green"
                  : "border-border bg-surface text-ink"
              }`}
            >
              {planSpec.name} Plan
            </span>
            {planExpiresAt && isPaid ? (
              <span className="font-mono text-[11px] text-ink-muted">
                Renews {formatDate(planExpiresAt)}
              </span>
            ) : null}
            {userEmail ? (
              <span className="font-mono text-xs text-ink-muted">
                {userEmail}
              </span>
            ) : null}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            Operations Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!isPaid ? (
            <Link
              href="/pricing"
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-utility-blue/30 bg-utility-blue/10 px-3.5 py-2.5 text-sm font-semibold text-utility-blue transition-colors hover:bg-utility-blue/15"
            >
              <Sparkles className="h-4 w-4" />
              <span>Upgrade</span>
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => setIsBulkImportOpen(true)}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas-muted"
          >
            <FileSpreadsheet className="h-4 w-4 text-utility-blue" />
            <span>Bulk Import CSV</span>
          </button>
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-action-green px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            <span>New QR / SOP</span>
          </Link>
        </div>
      </div>

      {justUpgraded ? (
        <div
          role="status"
          className="mb-6 flex items-center gap-2.5 rounded-lg border border-action-green/30 bg-action-green/10 px-4 py-3 text-xs font-medium text-action-green"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>
            Welcome to FastCC QR {planSpec.name}! Unlimited QR codes, watermark
            removal, custom logos, and CSV export are now active.
          </span>
        </div>
      ) : null}

      {errorBanner ? (
        <div
          role="alert"
          className="mb-6 flex items-center gap-2.5 rounded-lg border border-alert-red/30 bg-alert-red/5 px-4 py-3 text-xs text-alert-red"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorBanner}</span>
        </div>
      ) : null}

      {templateUpgradePrompt ? (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-3 rounded-lg border border-alert-red/30 bg-alert-red/5 px-4 py-3 text-xs text-ink sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 shrink-0 text-alert-red" />
            <span>{templateUpgradePrompt}</span>
          </div>
          <Link
            href="/pricing"
            className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg bg-action-green px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-95"
          >
            Upgrade to Pro
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      {/* Top KPI Cards */}
      <section
        aria-label="Key metrics"
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              Total QR Codes
            </span>
            <QrCode className="h-4 w-4" />
          </div>
          <p className="mt-2 font-mono text-3xl font-semibold text-ink">
            {qrCodes.length}
            {!isPaid ? (
              <span className="ml-1.5 text-sm font-normal text-ink-muted">
                / {FREE_QR_LIMIT}
              </span>
            ) : null}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              Total Scans
            </span>
            <ScanLine className="h-4 w-4 text-action-green" />
          </div>
          <p className="mt-2 font-mono text-3xl font-semibold text-ink">
            {totalScans}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              Total Inspection Logs
            </span>
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <p className="mt-2 font-mono text-3xl font-semibold text-ink">
            {logs.length}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-medium uppercase tracking-wider">
              Active AI SOPs / Forms
            </span>
            <Sparkles className="h-4 w-4 text-utility-blue" />
          </div>
          <p className="mt-2 font-mono text-3xl font-semibold text-ink">
            {activeAiCount}
            <span className="ml-2 text-xs font-normal text-ink-muted">
              {aiLimit === null
                ? `(${aiSopsUsed} used • Unlimited)`
                : `(${aiSopsUsed}/${aiLimit} AI quota)`}
            </span>
          </p>
        </div>
      </section>

      {/* Equipment & SOP QR Codes */}
      <section aria-labelledby="my-qr-heading" className="mb-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2
                id="my-qr-heading"
                className="text-base font-semibold tracking-tight text-ink"
              >
                Equipment &amp; SOP QR Codes
              </h2>
              <span className="font-mono text-xs text-ink-muted">
                {filteredQrCodes.length}{" "}
                {filteredQrCodes.length === 1 ? "record" : "records"}
              </span>
            </div>
            <p className="text-xs text-ink-muted">
              Select items below to print A4 sticker sheets
            </p>
          </div>

          {qrCodes.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={allowA4Print && selectedQrs.length === 0}
                title={
                  !allowA4Print
                    ? "Upgrade to Pro to print A4 sticker sheets"
                    : selectedQrs.length === 0
                      ? "Select 1+ QR codes to print"
                      : "Print A4 sticker sheets for selected QR codes"
                }
                onClick={() => {
                  if (!allowA4Print) {
                    setBulkPrintUpgradePrompt(true);
                    return;
                  }
                  if (selectedQrs.length === 0) return;
                  setIsBulkPrintOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {allowA4Print ? (
                  <Printer className="h-3.5 w-3.5 text-action-green" />
                ) : (
                  <Lock className="h-3.5 w-3.5 text-utility-blue" />
                )}
                <span>Print A4 Stickers</span>
                {!allowA4Print ? (
                  <span className="rounded bg-action-green/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-action-green">
                    Pro
                  </span>
                ) : null}
              </button>
              <div
                role="group"
                aria-label="Audit report date range"
                className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1"
              >
                <span className="inline-flex items-center gap-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  <Calendar className="h-3.5 w-3.5 text-utility-blue" />
                  Audit Range:
                </span>
                {AUDIT_DATE_RANGE_OPTIONS.map((option) => {
                  const active = auditDateRange === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAuditDateRange(option.id)}
                      aria-pressed={active}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "bg-ink text-white"
                          : "text-ink-muted hover:bg-canvas-muted hover:text-ink"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1">
                <Folder className="h-3.5 w-3.5 shrink-0 text-utility-blue" />
                <select
                  aria-label="Filter QR codes by location folder"
                  value={folderFilter}
                  onChange={(e) => setFolderFilter(e.target.value)}
                  className="bg-transparent pr-1 text-xs font-medium text-ink outline-none"
                >
                  <option value="all">All Folders ({qrCodes.length})</option>
                  {folderOptions.map((folder) => (
                    <option key={folder.name} value={folder.name}>
                      {folder.name} ({folder.count})
                    </option>
                  ))}
                </select>
              </div>

              <div
                role="group"
                aria-label="Filter QR codes by equipment status"
                className="flex flex-wrap items-center gap-1.5"
              >
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "faulty", label: "Faulty" },
                    { id: "maintenance", label: "Maintenance" },
                    { id: "ok", label: "OK" },
                    { id: "overdue", label: "Overdue" },
                  ] as const
                ).map((pill) => {
                  const active = statusFilter === pill.id;
                  const count = statusCounts[pill.id];
                  const activeClasses =
                    pill.id === "faulty" || pill.id === "overdue"
                      ? "border-alert-red bg-alert-red text-white"
                      : pill.id === "maintenance"
                        ? "border-amber-500 bg-amber-500 text-white"
                        : pill.id === "ok"
                          ? "border-action-green bg-action-green text-white"
                          : "border-ink bg-ink text-white";

                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setStatusFilter(pill.id)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? activeClasses
                          : pill.id === "overdue" && count > 0
                            ? "border-alert-red/40 bg-alert-red/5 text-alert-red hover:bg-alert-red/10"
                            : "border-border bg-surface text-ink-muted hover:bg-canvas-muted hover:text-ink"
                      }`}
                    >
                      <span>{pill.label}</span>
                      <span
                        suppressHydrationWarning
                        className="font-mono text-[11px] opacity-80"
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {bulkPrintUpgradePrompt && !allowA4Print ? (
          <div
            role="alert"
            className="mb-4 flex flex-col gap-3 rounded-lg border border-utility-blue/30 bg-utility-blue/5 px-4 py-3 text-xs text-ink sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0 text-utility-blue" />
              <span>
                A4 Bulk Sticker Sheet PDF is available on Pro (₹999/mo) and
                Business plans.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/pricing"
                className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg bg-action-green px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-95"
              >
                <span>Upgrade to Pro</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setBulkPrintUpgradePrompt(false)}
                aria-label="Dismiss upgrade prompt"
                className="rounded p-1 text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : null}

        {qrCodes.length === 0 ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <QrCode className="mx-auto h-8 w-8 text-ink-muted" />
              <p className="mt-3 text-sm font-medium text-ink">
                No QR codes saved to your account yet
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                Launch an industry-ready SOP &amp; checklist in 1 click below,
                or create a custom QR in the workbench.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-action-green px-4 py-2 text-xs font-medium text-white hover:opacity-95"
              >
                <Plus className="h-3.5 w-3.5" />
                Open QR Workbench
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    Quick-Launch Industry Templates
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Start with a pre-built Indian compliance SOP and 5-point
                    worker checklist.
                  </p>
                </div>
                <span className="rounded border border-border bg-canvas-muted px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                  1-Click Setup
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {INDUSTRY_TEMPLATES.map((template) => {
                  const Icon = TEMPLATE_ICONS[template.id] ?? QrCode;
                  const isLaunching = launchingTemplateId === template.id;
                  return (
                    <div
                      key={template.id}
                      className="flex flex-col justify-between rounded-xl border border-border bg-canvas p-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-ink">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                            {template.category}
                          </span>
                        </div>
                        <h4 className="mt-3 text-sm font-semibold text-ink">
                          {template.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                          {template.steps.length} SOP steps •{" "}
                          {template.checklist.length} checks
                        </p>
                      </div>

                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          type="button"
                          disabled={launchingTemplateId !== null}
                          onClick={() => handleQuickLaunchTemplate(template)}
                          className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-action-green px-3 text-xs font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                        >
                          {isLaunching ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              Create Live QR
                              <ArrowRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                        <Link
                          href={`/?template=${template.id}`}
                          className="inline-flex min-h-8 w-full items-center justify-center rounded-lg border border-border bg-surface px-3 text-xs font-medium text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink"
                        >
                          Customize in Workbench
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : filteredQrCodes.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm font-medium text-ink">
              No QR codes match the active{" "}
              {folderFilter !== "all" ? (
                <>
                  folder <span className="font-mono">{folderFilter}</span>
                  {statusFilter !== "all" ? " and " : " "}
                </>
              ) : null}
              {statusFilter !== "all" ? (
                <>
                  status{" "}
                  <span className="font-mono uppercase">{statusFilter}</span>{" "}
                </>
              ) : null}
              filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setFolderFilter("all");
                setStatusFilter("all");
              }}
              className="mt-3 inline-flex items-center rounded-lg border border-border bg-canvas px-3 py-1.5 text-xs font-medium text-ink hover:bg-canvas-muted"
            >
              Show all QR codes
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-canvas-muted/70 text-xs font-medium uppercase tracking-wider text-ink-muted">
                    <th className="w-10 px-4 py-3">
                      <input
                        ref={selectAllCheckboxRef}
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={handleToggleSelectAll}
                        aria-label="Select all visible QR codes"
                        className="h-4 w-4 cursor-pointer rounded border-border accent-action-green"
                      />
                    </th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Short Code</th>
                    <th className="px-4 py-3">Scans</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredQrCodes.map((qr) => {
                    const isCopied = copiedCode === qr.short_code;
                    const isDeleting = deletingId === qr.id;
                    const isSelected = selectedIds.has(qr.id);
                    const scheduleStatus = getScheduleStatus(qr, nowMs);
                    return (
                      <tr
                        key={qr.id}
                        className={`transition-colors hover:bg-canvas/60 ${
                          isSelected ? "bg-action-green/[0.04]" : ""
                        }`}
                      >
                        <td className="w-10 px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectOne(qr.id)}
                            aria-label={`Select ${qr.title}`}
                            className="h-4 w-4 cursor-pointer rounded border-border accent-action-green"
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-ink">
                              {qr.title}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[11px] ${
                                getQrFolder(qr) === UNASSIGNED_FOLDER
                                  ? "border-border bg-canvas text-ink-muted/80"
                                  : "border-utility-blue/25 bg-utility-blue/5 text-ink"
                              }`}
                            >
                              <Folder
                                className={`h-3 w-3 ${
                                  getQrFolder(qr) === UNASSIGNED_FOLDER
                                    ? "text-ink-muted/70"
                                    : "text-utility-blue"
                                }`}
                              />
                              {getQrFolder(qr)}
                            </span>
                            {scheduleStatus.schedule !== "none" ? (
                              scheduleStatus.isOverdue ? (
                                <span
                                  title={`${scheduleStatus.scheduleLabel} • ${scheduleStatus.label}`}
                                  suppressHydrationWarning
                                  className="inline-flex items-center gap-1 rounded border border-alert-red/40 bg-alert-red/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-alert-red"
                                >
                                  <Clock className="h-3 w-3" />
                                  OVERDUE
                                  <span className="font-normal">
                                    · {scheduleStatus.scheduleLabel} •{" "}
                                    {scheduleStatus.label}
                                  </span>
                                </span>
                              ) : (
                                <span
                                  title={`${scheduleStatus.scheduleLabel} • ${scheduleStatus.label}`}
                                  suppressHydrationWarning
                                  className="inline-flex items-center gap-1 rounded border border-action-green/25 bg-action-green/5 px-1.5 py-0.5 font-mono text-[11px] text-action-green"
                                >
                                  <Clock className="h-3 w-3" />
                                  {scheduleStatus.scheduleLabel} •{" "}
                                  {scheduleStatus.label}
                                </span>
                              )
                            ) : null}
                          </div>
                          {qr.description ? (
                            <div className="mt-0.5 max-w-xs truncate text-xs text-ink-muted">
                              {qr.description}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <EquipmentStatusBadge
                            status={qr.current_status ?? "ok"}
                          />
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <TypeBadge type={qr.type} category={qr.category} />
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-ink">
                          {qr.short_code}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs font-semibold text-ink">
                          {qr.scan_count ?? 0}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-ink-muted">
                          {formatDate(qr.created_at)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="ml-auto flex max-w-[360px] flex-wrap items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAuditExport(qr, "pdf")}
                              disabled={exportingAuditKey !== null}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-canvas-muted disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {exportingAuditKey === `${qr.id}:pdf` ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-utility-blue" />
                              ) : (
                                <FileText className="h-3.5 w-3.5 text-utility-blue" />
                              )}
                              <span>Export Audit PDF</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAuditExport(qr, "csv")}
                              disabled={exportingAuditKey !== null}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-canvas-muted disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {exportingAuditKey === `${qr.id}:csv` ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-action-green" />
                              ) : allowCsvExport ? (
                                <Download className="h-3.5 w-3.5 text-action-green" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 text-utility-blue" />
                              )}
                              <span>Export CSV</span>
                              {!allowCsvExport ? (
                                <span className="rounded bg-action-green/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-action-green">
                                  Pro
                                </span>
                              ) : null}
                            </button>
                            <Link
                              href={`/studio/${qr.short_code}`}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-canvas-muted"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              <span>Studio (Print)</span>
                            </Link>
                            <Link
                              href={`/q/${qr.short_code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-utility-blue transition-colors hover:bg-canvas-muted"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>Worker View</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(qr.short_code)}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-action-green" />
                                  <span className="text-action-green">
                                    Copied
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQr(qr)}
                              disabled={isDeleting}
                              aria-label={`Delete ${qr.title}`}
                              className="inline-flex items-center gap-1 rounded-md border border-alert-red/30 bg-surface px-2.5 py-1.5 text-xs font-medium text-alert-red transition-colors hover:bg-alert-red/5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>{isDeleting ? "..." : "Delete"}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {qrCodes.length > 0 ? (
        <section
          aria-labelledby="quick-templates-heading"
          className="mb-10 rounded-xl border border-border bg-surface p-4 sm:p-5"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2
                id="quick-templates-heading"
                className="text-sm font-semibold text-ink"
              >
                Quick-Launch Industry Templates
              </h2>
              <p className="text-xs text-ink-muted">
                Spin up a ready-to-print SOP &amp; 5-point checklist QR in 1
                click.
              </p>
            </div>
            <Link
              href="/#templates"
              className="text-xs font-medium text-utility-blue hover:underline"
            >
              Customize in Workbench
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRY_TEMPLATES.map((template) => {
              const Icon = TEMPLATE_ICONS[template.id] ?? QrCode;
              const isLaunching = launchingTemplateId === template.id;
              return (
                <button
                  key={template.id}
                  type="button"
                  disabled={launchingTemplateId !== null}
                  onClick={() => handleQuickLaunchTemplate(template)}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-canvas px-3 py-2.5 text-left transition-colors hover:border-action-green disabled:opacity-60"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-ink">
                      <Icon className="h-4 w-4" />
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
                  {isLaunching ? (
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-action-green" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 shrink-0 text-action-green" />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Inspection Logs */}
      <section aria-labelledby="inspection-logs-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              id="inspection-logs-heading"
              className="text-base font-semibold tracking-tight text-ink"
            >
              Inspection Logs
            </h2>
            <p className="text-xs text-ink-muted">
              Live frontline worker submissions across your QR codes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isPaid && logs.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-canvas-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPaid ? (
              <Download className="h-3.5 w-3.5 text-utility-blue" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-utility-blue" />
            )}
            <span>Export CSV</span>
            {!isPaid ? (
              <span className="rounded bg-action-green/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-action-green">
                Pro
              </span>
            ) : null}
          </button>
        </div>

        {csvUpgradePrompt && !isPaid ? (
          <div
            role="alert"
            className="mb-4 flex flex-col gap-3 rounded-lg border border-utility-blue/30 bg-utility-blue/5 px-4 py-3 text-xs text-ink sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0 text-utility-blue" />
              <span>
                CSV Inspection Log export is available on Pro (₹999/mo) and
                Business plans.
              </span>
            </div>
            <Link
              href="/pricing"
              className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg bg-action-green px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-95"
            >
              Upgrade to Pro
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}

        {logs.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <ClipboardCheck className="mx-auto h-8 w-8 text-ink-muted" />
            <p className="mt-3 text-sm font-medium text-ink">
              No inspection logs submitted yet
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              When workers scan a QR code and submit a check on{" "}
              <code className="font-mono">/q/[id]</code>, entries appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-canvas-muted/70 text-xs font-medium uppercase tracking-wider text-ink-muted">
                    <th className="px-4 py-3">Worker Name</th>
                    <th className="px-4 py-3">QR Title</th>
                    <th className="px-4 py-3">Notes / Status</th>
                    <th className="px-4 py-3">Signature</th>
                    <th className="px-4 py-3">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => {
                    const qr = qrLookup.get(log.qr_code_id);
                    const signatureUrl = extractSignatureDataUrl(
                      log.step_results,
                    );
                    return (
                      <tr
                        key={log.id}
                        className="transition-colors hover:bg-canvas/60"
                      >
                        <td className="px-4 py-3.5 font-medium text-ink whitespace-nowrap">
                          {log.inspector_name}
                        </td>
                        <td className="px-4 py-3.5">
                          {qr ? (
                            <Link
                              href={`/studio/${qr.short_code}`}
                              className="font-medium text-utility-blue hover:underline"
                            >
                              {qr.title}
                            </Link>
                          ) : (
                            <span className="text-ink-muted">Deleted QR</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <EquipmentStatusBadge
                              status={resolveLogEquipmentStatus(log)}
                            />
                            {log.notes ? (
                              <span className="max-w-md truncate text-xs text-ink-muted">
                                {log.notes}
                              </span>
                            ) : (
                              <span className="text-xs text-ink-muted/70">
                                No notes
                              </span>
                            )}
                            {log.photo_url ? (
                              <a
                                href={log.photo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-canvas px-2 py-1 text-xs font-medium text-utility-blue transition-colors hover:bg-canvas-muted"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={log.photo_url}
                                  alt={`Inspection proof by ${log.inspector_name}`}
                                  className="h-5 w-5 rounded object-cover"
                                />
                                <span>View Photo</span>
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {signatureUrl ? (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewSignature({
                                  url: signatureUrl,
                                  workerName: log.inspector_name,
                                  submittedAt: formatDateTime(log.created_at),
                                })
                              }
                              title="Click to enlarge worker signature"
                              className="inline-flex items-center rounded border border-border bg-white p-0.5 transition-colors hover:border-utility-blue"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={signatureUrl}
                                alt={`Signature of ${log.inspector_name}`}
                                className="h-7 w-20 object-contain"
                              />
                            </button>
                          ) : (
                            <span className="font-mono text-xs text-ink-muted/60">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-ink-muted">
                          {formatDateTime(log.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {selectedQrs.length > 0 ? (
        <div
          role="region"
          aria-label="Bulk QR actions"
          className="fixed inset-x-0 bottom-4 z-40 mx-auto max-w-2xl px-4"
        >
          <div className="space-y-2.5 rounded-xl border border-border bg-surface px-4 py-3 shadow-lg">
            {bulkPrintUpgradePrompt && !allowA4Print ? (
              <div
                role="alert"
                className="flex flex-col gap-2.5 rounded-lg border border-utility-blue/30 bg-utility-blue/5 px-3 py-2.5 text-xs text-ink sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 shrink-0 text-utility-blue" />
                  <span>
                    A4 Bulk Sticker Sheet PDF is available on Pro (₹999/mo) and
                    Business plans.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/pricing"
                    className="inline-flex w-fit shrink-0 items-center gap-1 rounded-lg bg-action-green px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                  >
                    <span>Upgrade to Pro</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setBulkPrintUpgradePrompt(false)}
                    aria-label="Dismiss upgrade prompt"
                    className="rounded p-1 text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs font-semibold text-ink">
                {selectedQrs.length} {selectedQrs.length === 1 ? "QR" : "QRs"}{" "}
                selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!allowA4Print) {
                      setBulkPrintUpgradePrompt(true);
                      return;
                    }
                    setIsBulkPrintOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-action-green px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-95"
                >
                  {allowA4Print ? (
                    <Printer className="h-3.5 w-3.5" />
                  ) : (
                    <Lock className="h-3.5 w-3.5" />
                  )}
                  <span>Print A4 Sticker Sheet</span>
                  {!allowA4Print ? (
                    <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-white">
                      Pro
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <BulkPrintModal
        isOpen={isBulkPrintOpen}
        onClose={() => setIsBulkPrintOpen(false)}
        selectedQrs={selectedQrs}
        plan={plan}
      />

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        existingQrCount={qrCodes.length}
        plan={plan}
        onImported={handleBulkImported}
      />

      {auditToast ? (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-4 bottom-4 z-50 flex max-w-md items-center gap-3 rounded-xl border px-4 py-3 text-xs font-medium shadow-lg ${
            auditToast.tone === "error"
              ? "border-alert-red/40 bg-surface text-alert-red"
              : "border-border bg-surface text-ink"
          }`}
        >
          <AlertCircle
            className={`h-4 w-4 shrink-0 ${
              auditToast.tone === "error"
                ? "text-alert-red"
                : "text-utility-blue"
            }`}
          />
          <span>{auditToast.message}</span>
          <button
            type="button"
            onClick={() => setAuditToast(null)}
            aria-label="Dismiss notification"
            className="rounded p-1 text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {previewSignature ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Worker signature preview"
          onClick={() => setPreviewSignature(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-[1px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-ink">
                  Worker Digital Signature
                </h3>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {previewSignature.workerName} • {previewSignature.submittedAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewSignature(null)}
                aria-label="Close signature preview"
                className="rounded-md p-1 text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center rounded-lg border border-border bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSignature.url}
                alt={`Digital signature of ${previewSignature.workerName}`}
                className="max-h-44 w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
