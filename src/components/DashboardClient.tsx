"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  ClipboardCheck,
  Copy,
  Download,
  ExternalLink,
  Plus,
  Printer,
  QrCode,
  Sparkles,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getQrScanUrl } from "@/lib/qr-utils";
import type { InspectionLogRow, QrCodeRow } from "@/types/qr";

interface DashboardClientProps {
  userEmail: string;
  initialQrCodes: QrCodeRow[];
  initialLogs: InspectionLogRow[];
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
}: DashboardClientProps) {
  const router = useRouter();
  const [qrCodes, setQrCodes] = useState<QrCodeRow[]>(initialQrCodes);
  const [logs, setLogs] = useState<InspectionLogRow[]>(initialLogs);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

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
    if (logs.length === 0) return;

    const header = [
      "Worker Name",
      "QR Title",
      "Short Code",
      "Status",
      "Notes",
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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-border bg-canvas-muted px-2 py-0.5 font-mono text-[11px] font-medium text-ink-muted">
              MANAGER CONSOLE
            </span>
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

        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-action-green px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          <span>New QR / SOP</span>
        </Link>
      </div>

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
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
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
          </p>
        </div>
      </section>

      {/* My QR Codes */}
      <section aria-labelledby="my-qr-heading" className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="my-qr-heading"
            className="text-base font-semibold tracking-tight text-ink"
          >
            My QR Codes
          </h2>
          <span className="font-mono text-xs text-ink-muted">
            {qrCodes.length} {qrCodes.length === 1 ? "record" : "records"}
          </span>
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
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-canvas-muted/70 text-xs font-medium uppercase tracking-wider text-ink-muted">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Short Code</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {qrCodes.map((qr) => {
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
                          <TypeBadge type={qr.type} category={qr.category} />
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-ink">
                          {qr.short_code}
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
            disabled={logs.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-canvas-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5 text-utility-blue" />
            <span>Export CSV</span>
          </button>
        </div>

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
