"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Download,
  ExternalLink,
  Lock,
  Plus,
  Printer,
  QrCode,
  ScanLine,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  FREE_QR_LIMIT,
  getAiSopLimit,
  isPaidPlan,
  PLAN_SPECS,
} from "@/lib/billing/constants";
import { createClient } from "@/lib/supabase/client";
import { getQrScanUrl } from "@/lib/qr-utils";
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
  standard: "standard",
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

function StatusBadge({ status }: { status: InspectionLogRow["status"] }) {
  if (status === "pass") {
    return (
      <span className="inline-flex items-center rounded-md border border-action-green/30 bg-action-green/10 px-2 py-0.5 font-mono text-xs font-medium uppercase text-action-green">
        PASS
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md border border-alert-red/30 bg-alert-red/10 px-2 py-0.5 font-mono text-xs font-medium uppercase text-alert-red">
      {status}
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
  const [statusFilter, setStatusFilter] = useState<"all" | EquipmentStatus>(
    "all",
  );

  const isPaid = isPaidPlan(plan);
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

  const statusCounts = useMemo(() => {
    const counts: Record<"all" | EquipmentStatus, number> = {
      all: qrCodes.length,
      faulty: 0,
      maintenance: 0,
      ok: 0,
    };
    for (const qr of qrCodes) {
      const status = qr.current_status ?? "ok";
      counts[status] += 1;
    }
    return counts;
  }, [qrCodes]);

  const filteredQrCodes = useMemo(() => {
    if (statusFilter === "all") return qrCodes;
    return qrCodes.filter((qr) => (qr.current_status ?? "ok") === statusFilter);
  }, [qrCodes, statusFilter]);

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
      router.refresh();
    } catch {
      setErrorBanner(`Unexpected error deleting "${qr.title}".`);
    } finally {
      setDeletingId(null);
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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
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

      {/* My QR Codes */}
      <section aria-labelledby="my-qr-heading" className="mb-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2
              id="my-qr-heading"
              className="text-base font-semibold tracking-tight text-ink"
            >
              My QR Codes
            </h2>
            <span className="font-mono text-xs text-ink-muted">
              {filteredQrCodes.length}{" "}
              {filteredQrCodes.length === 1 ? "record" : "records"}
            </span>
          </div>

          {qrCodes.length > 0 ? (
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
                ] as const
              ).map((pill) => {
                const active = statusFilter === pill.id;
                const count = statusCounts[pill.id];
                const activeClasses =
                  pill.id === "faulty"
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
                        : "border-border bg-surface text-ink-muted hover:bg-canvas-muted hover:text-ink"
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span className="font-mono text-[11px] opacity-80">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {qrCodes.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <QrCode className="mx-auto h-8 w-8 text-ink-muted" />
            <p className="mt-3 text-sm font-medium text-ink">
              No QR codes saved to your account yet
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Create a Standard URL, AI Video-to-SOP, or AI Paper-to-Form while
              signed in to manage it here.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-action-green px-4 py-2 text-xs font-medium text-white hover:opacity-95"
            >
              <Plus className="h-3.5 w-3.5" />
              Create First QR Code
            </Link>
          </div>
        ) : filteredQrCodes.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm font-medium text-ink">
              No QR codes match the{" "}
              <span className="font-mono uppercase">{statusFilter}</span> filter.
            </p>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
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
                    return (
                      <tr
                        key={qr.id}
                        className="transition-colors hover:bg-canvas/60"
                      >
                        <td className="px-4 py-3.5">
                          <div className="font-medium text-ink">{qr.title}</div>
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
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
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
                    <th className="px-4 py-3">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => {
                    const qr = qrLookup.get(log.qr_code_id);
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
                            <StatusBadge status={log.status} />
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
    </main>
  );
}
