"use client";

import { useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getDemoQrRecord,
  getDemoSopSteps,
  getLocalQrRecord,
  getLocalSopSteps,
  saveLocalInspectionLog,
} from "@/lib/qr-utils";
import type { PaperFormField, VideoSopChecklistItem } from "@/types/ai";
import type { InspectionStatus, Json } from "@/types/database";
import type { QrCodeRow, SopStepRow } from "@/types/qr";

const WORKER_LANGUAGES = [
  "English",
  "Hindi",
  "Hinglish",
  "Telugu",
  "Tamil",
] as const;
type WorkerLanguage = (typeof WORKER_LANGUAGES)[number];

interface WorkerScanClientProps {
  routeId: string;
  initialRecord: QrCodeRow | null;
  initialSteps: SopStepRow[];
  supabaseConfigured: boolean;
}

interface ParsedConfig {
  summary?: string;
  checklist: VideoSopChecklistItem[];
  fields: PaperFormField[];
  url?: string;
  fileUrl?: string;
}

interface SubmittedConfirmation {
  inspectorName: string;
  status: InspectionStatus;
  submittedAt: string;
  savedLocally: boolean;
  photoName: string | null;
}

const subscribeNoop = () => () => {};

function isRecord(value: unknown): value is Record<string, Json | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseConfigJson(config: Json): ParsedConfig {
  if (!isRecord(config)) {
    return { checklist: [], fields: [] };
  }

  const summary =
    typeof config.summary === "string" && config.summary.trim()
      ? config.summary.trim()
      : undefined;

  const checklist: VideoSopChecklistItem[] = Array.isArray(config.checklist)
    ? config.checklist
        .filter(isRecord)
        .map((item) => ({
          label:
            typeof item.label === "string" && item.label.trim()
              ? item.label.trim()
              : "Verify step completed",
          required: typeof item.required === "boolean" ? item.required : true,
        }))
    : [];

  const fields: PaperFormField[] = Array.isArray(config.fields)
    ? config.fields
        .filter(isRecord)
        .map((item, idx) => {
          const rawType = item.type;
          const type =
            rawType === "pass_fail" ||
            rawType === "text" ||
            rawType === "number" ||
            rawType === "photo"
              ? rawType
              : "pass_fail";

          const translations: Record<string, string> = {};
          if (isRecord(item.translations)) {
            for (const [lang, val] of Object.entries(item.translations)) {
              if (typeof val === "string" && val.trim()) {
                translations[lang] = val.trim();
              }
            }
          }

          return {
            id:
              typeof item.id === "string" && item.id.trim()
                ? item.id.trim()
                : `field_${idx + 1}`,
            label:
              typeof item.label === "string" && item.label.trim()
                ? item.label.trim()
                : `Check ${idx + 1}`,
            type,
            required: typeof item.required === "boolean" ? item.required : true,
            translations,
          };
        })
    : [];

  const url =
    typeof config.url === "string" && config.url.trim()
      ? config.url.trim()
      : undefined;
  const fileUrl =
    typeof config.fileUrl === "string" && config.fileUrl.trim()
      ? config.fileUrl.trim()
      : undefined;

  return { summary, checklist, fields, url, fileUrl };
}

function formatTimestampSec(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getStepLocalizedText(
  step: SopStepRow,
  language: WorkerLanguage,
): { title: string; instruction: string } {
  if (isRecord(step.translations_json)) {
    const entry = step.translations_json[language];
    if (isRecord(entry)) {
      const trTitle =
        typeof entry.title === "string" && entry.title.trim()
          ? entry.title.trim()
          : step.title;
      const trDesc =
        typeof entry.description === "string" && entry.description.trim()
          ? entry.description.trim()
          : step.instruction;
      return { title: trTitle, instruction: trDesc };
    }
  }
  return { title: step.title, instruction: step.instruction };
}

function getSafeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export function WorkerScanClient({
  routeId,
  initialRecord,
  initialSteps,
  supabaseConfigured,
}: WorkerScanClientProps) {
  const localRecord = useSyncExternalStore(
    subscribeNoop,
    () => (initialRecord ? null : getLocalQrRecord(routeId)),
    () => null,
  );

  const localSteps = useSyncExternalStore(
    subscribeNoop,
    () =>
      initialSteps.length > 0
        ? initialSteps
        : getLocalSopSteps(localRecord?.short_code ?? routeId),
    () => initialSteps,
  );

  const isDemoFallback = !initialRecord && !localRecord;
  const record = initialRecord ?? localRecord ?? getDemoQrRecord(routeId);
  const steps =
    initialSteps.length > 0
      ? initialSteps
      : localSteps.length > 0
        ? localSteps
        : isDemoFallback && record.type === "video_sop"
          ? getDemoSopSteps()
          : [];

  const isLocalFallback = !initialRecord;
  const parsedConfig = parseConfigJson(record.config_json);

  const effectiveType: "video_sop" | "paper_form" | "url" | "file" =
    record.type === "video_sop"
      ? "video_sop"
      : record.type === "paper_form"
        ? "paper_form"
        : record.type === "url" ||
            (record.type === "standard" && record.category === "url")
          ? "url"
          : "file";

  const [language, setLanguage] = useState<WorkerLanguage>("English");
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [fieldPhotoNames, setFieldPhotoNames] = useState<Record<string, string>>(
    {},
  );
  const [workerName, setWorkerName] = useState("");
  const [notes, setNotes] = useState("");
  const [proofPhotoName, setProofPhotoName] = useState<string | null>(null);
  const [proofPhotoPreview, setProofPhotoPreview] = useState<string | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] =
    useState<SubmittedConfirmation | null>(null);

  const checklistItems: VideoSopChecklistItem[] =
    parsedConfig.checklist.length > 0
      ? parsedConfig.checklist
      : steps.map((s) => ({ label: s.title, required: s.is_critical }));

  function toggleChecklistItem(idx: number) {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function handleProofPhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProofPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleFieldPhotoChange(
    fieldId: string,
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFieldPhotoNames((prev) => ({ ...prev, [fieldId]: file.name }));
    setFormValues((prev) => ({ ...prev, [fieldId]: `photo:${file.name}` }));
  }

  async function handleSubmitLog(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const trimmedName = workerName.trim();
    if (!trimmedName) {
      setSubmitError("Please enter your name before submitting the log.");
      return;
    }

    if (effectiveType === "video_sop") {
      const missingRequired = checklistItems.some(
        (item, idx) => item.required && !checkedItems[idx],
      );
      if (missingRequired) {
        setSubmitError(
          "Please complete all required QC checklist items before submitting.",
        );
        return;
      }
    }

    if (effectiveType === "paper_form") {
      const missingField = parsedConfig.fields.find(
        (field) => field.required && !formValues[field.id]?.trim(),
      );
      if (missingField) {
        const localizedLabel =
          missingField.translations[language] ?? missingField.label;
        setSubmitError(`Please complete required field: "${localizedLabel}".`);
        return;
      }
    }

    let status: InspectionStatus = "pass";
    if (effectiveType === "paper_form") {
      const hasFail = parsedConfig.fields.some(
        (f) => f.type === "pass_fail" && formValues[f.id] === "fail",
      );
      if (hasFail) status = "fail";
    }

    const stepResultsPayload = {
      language,
      checklist_results:
        effectiveType === "video_sop"
          ? checklistItems.map((item, idx) => ({
              label: item.label,
              required: item.required,
              checked: Boolean(checkedItems[idx]),
            }))
          : undefined,
      form_values: effectiveType === "paper_form" ? formValues : undefined,
      field_photos:
        effectiveType === "paper_form" && Object.keys(fieldPhotoNames).length > 0
          ? fieldPhotoNames
          : undefined,
      photo_proof_name: proofPhotoName,
    } as unknown as Json;

    setIsSubmitting(true);
    let savedLocally = isLocalFallback || !supabaseConfigured;
    const submittedAt = new Date().toISOString();

    if (!savedLocally) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("inspection_logs").insert({
          qr_code_id: record.id,
          inspector_name: trimmedName,
          status,
          notes: notes.trim() || null,
          step_results: stepResultsPayload,
        });
        if (error) {
          savedLocally = true;
        }
      } catch {
        savedLocally = true;
      }
    }

    if (savedLocally) {
      saveLocalInspectionLog({
        qr_code_id: record.id,
        inspector_name: trimmedName,
        status,
        notes: notes.trim() || null,
        step_results: stepResultsPayload,
        created_at: submittedAt,
      });
    }

    setIsSubmitting(false);
    setConfirmation({
      inspectorName: trimmedName,
      status,
      submittedAt,
      savedLocally,
      photoName: proofPhotoName,
    });
  }

  function handleResetConfirmation() {
    setConfirmation(null);
    setCheckedItems({});
    setFormValues({});
    setFieldPhotoNames({});
    setNotes("");
    setProofPhotoName(null);
    setProofPhotoPreview(null);
    setSubmitError(null);
  }

  const showLanguageSwitcher =
    effectiveType === "video_sop" || effectiveType === "paper_form";
  const safeExternalUrl = getSafeExternalUrl(
    parsedConfig.url ?? parsedConfig.fileUrl ?? record.description,
  );

  return (
    <main className="min-h-screen bg-canvas text-ink">
      {showLanguageSwitcher ? (
        <div className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-lg items-center gap-2 overflow-x-auto px-4 py-2.5">
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-ink-muted">
              <Globe className="h-4 w-4" />
            </span>
            {WORKER_LANGUAGES.map((lang) => {
              const active = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`min-h-12 shrink-0 rounded-lg border px-3.5 text-sm font-semibold transition-colors ${
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-border bg-canvas text-ink hover:bg-canvas-muted"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-6">
        <header className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-action-green">
              <ClipboardCheck className="h-4 w-4" />
              {effectiveType === "video_sop"
                ? "Video SOP"
                : effectiveType === "paper_form"
                  ? "Digital Form"
                  : effectiveType === "url"
                    ? "Operational Link"
                    : "Shop-Floor Reference"}
            </span>
            <span className="rounded border border-border bg-canvas-muted px-2 py-0.5 font-mono text-xs text-ink-muted">
              {record.short_code}
            </span>
          </div>

          <h1 className="mt-2.5 text-xl font-bold tracking-tight text-ink">
            {record.title}
          </h1>

          {parsedConfig.summary || record.description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {parsedConfig.summary ?? record.description}
            </p>
          ) : null}

          {isLocalFallback ? (
            <div className="mt-3 rounded-lg border border-border bg-canvas px-3 py-2 text-xs text-ink-muted">
              Preview mode: loaded from{" "}
              {isDemoFallback ? "built-in demo SOP" : "local device storage"}.
            </div>
          ) : null}
        </header>

        {confirmation ? (
          <section className="rounded-xl border-2 border-action-green bg-surface p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-action-green/10 text-action-green">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-3 text-xl font-bold text-ink">
              Logged Successfully
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Inspection recorded for{" "}
              <span className="font-semibold text-ink">
                {confirmation.inspectorName}
              </span>
              .
            </p>

            <div className="mt-4 space-y-2 rounded-lg border border-border bg-canvas p-4 text-left text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Status</span>
                <span
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                    confirmation.status === "fail"
                      ? "bg-alert-red/10 text-alert-red"
                      : "bg-action-green/10 text-action-green"
                  }`}
                >
                  {confirmation.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Timestamp</span>
                <span className="font-mono text-xs text-ink">
                  {new Date(confirmation.submittedAt).toLocaleString()}
                </span>
              </div>
              {confirmation.photoName ? (
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Photo Proof</span>
                  <span className="truncate font-mono text-xs text-ink">
                    {confirmation.photoName}
                  </span>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleResetConfirmation}
              className="mt-5 min-h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:bg-canvas-muted"
            >
              Submit Another Log
            </button>
          </section>
        ) : (
          <>
            {effectiveType === "video_sop" ? (
              <>
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Step-by-Step Instructions ({steps.length})
                  </h2>
                  {steps.length === 0 ? (
                    <div className="rounded-xl border border-border bg-surface p-5 text-sm text-ink-muted">
                      No SOP steps attached yet. Complete the QC checklist below
                      to log your inspection.
                    </div>
                  ) : (
                    steps.map((step) => {
                      const localized = getStepLocalizedText(step, language);
                      const timeLabel = formatTimestampSec(step.timestamp_sec);
                      return (
                        <article
                          key={step.id}
                          className={`rounded-xl border p-4 ${
                            step.is_critical
                              ? "border-alert-red/50 bg-alert-red/5"
                              : "border-border bg-surface"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink font-mono text-sm font-bold text-white">
                                {step.step_order}
                              </span>
                              <h3 className="text-base font-semibold leading-snug text-ink">
                                {localized.title}
                              </h3>
                            </div>
                            {timeLabel ? (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded border border-border bg-canvas-muted px-2 py-1 font-mono text-xs font-medium text-ink-muted">
                                <Clock className="h-3.5 w-3.5" />
                                {timeLabel}
                              </span>
                            ) : null}
                          </div>

                          {localized.instruction ? (
                            <p className="mt-2.5 pl-10.5 text-sm leading-relaxed text-ink-muted">
                              {localized.instruction}
                            </p>
                          ) : null}

                          {step.is_critical ? (
                            <div className="mt-3 flex items-center gap-1.5 pl-10.5 text-xs font-semibold text-alert-red">
                              <AlertTriangle className="h-4 w-4 shrink-0" />
                              Critical Safety / Quality Step
                            </div>
                          ) : null}
                        </article>
                      );
                    })
                  )}
                </section>

                <section className="rounded-xl border border-border bg-surface p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-ink">
                      QC Checklist
                    </h2>
                    <span className="font-mono text-xs text-ink-muted">
                      {
                        checklistItems.filter((_, idx) => checkedItems[idx])
                          .length
                      }
                      /{checklistItems.length} checked
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {checklistItems.map((item, idx) => {
                      const isChecked = Boolean(checkedItems[idx]);
                      return (
                        <button
                          key={`${item.label}-${idx}`}
                          type="button"
                          onClick={() => toggleChecklistItem(idx)}
                          aria-pressed={isChecked}
                          className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                            isChecked
                              ? "border-action-green bg-action-green/10 text-ink"
                              : "border-border bg-canvas text-ink hover:bg-canvas-muted"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border ${
                                isChecked
                                  ? "border-action-green bg-action-green text-white"
                                  : "border-border bg-surface"
                              }`}
                            >
                              {isChecked ? <Check className="h-4 w-4" /> : null}
                            </span>
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </div>
                          {item.required ? (
                            <span className="shrink-0 rounded bg-canvas-muted px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                              Required
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </>
            ) : null}

            {effectiveType === "paper_form" ? (
              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Inspection Fields ({parsedConfig.fields.length})
                </h2>

                {parsedConfig.fields.map((field) => {
                  const localizedLabel =
                    field.translations[language] ?? field.label;
                  const value = formValues[field.id] ?? "";

                  return (
                    <div
                      key={field.id}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <label
                          htmlFor={`field-${field.id}`}
                          className="text-sm font-semibold text-ink"
                        >
                          {localizedLabel}
                        </label>
                        {field.required ? (
                          <span className="shrink-0 rounded bg-canvas-muted px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                            Required
                          </span>
                        ) : null}
                      </div>

                      {field.type === "pass_fail" ? (
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setFormValues((prev) => ({
                                ...prev,
                                [field.id]: "pass",
                              }))
                            }
                            className={`flex min-h-12 items-center justify-center gap-2 rounded-lg border text-sm font-bold transition-colors ${
                              value === "pass"
                                ? "border-action-green bg-action-green text-white"
                                : "border-border bg-canvas text-ink hover:bg-canvas-muted"
                            }`}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                            PASS
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormValues((prev) => ({
                                ...prev,
                                [field.id]: "fail",
                              }))
                            }
                            className={`flex min-h-12 items-center justify-center gap-2 rounded-lg border text-sm font-bold transition-colors ${
                              value === "fail"
                                ? "border-alert-red bg-alert-red text-white"
                                : "border-border bg-canvas text-ink hover:bg-canvas-muted"
                            }`}
                          >
                            <XCircle className="h-5 w-5" />
                            FAIL
                          </button>
                        </div>
                      ) : null}

                      {field.type === "text" ? (
                        <input
                          id={`field-${field.id}`}
                          type="text"
                          value={value}
                          onChange={(e) =>
                            setFormValues((prev) => ({
                              ...prev,
                              [field.id]: e.target.value,
                            }))
                          }
                          placeholder="Enter observation..."
                          className="mt-2.5 min-h-12 w-full rounded-lg border border-border bg-canvas px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
                        />
                      ) : null}

                      {field.type === "number" ? (
                        <input
                          id={`field-${field.id}`}
                          type="number"
                          inputMode="decimal"
                          value={value}
                          onChange={(e) =>
                            setFormValues((prev) => ({
                              ...prev,
                              [field.id]: e.target.value,
                            }))
                          }
                          placeholder="0.00"
                          className="mt-2.5 min-h-12 w-full rounded-lg border border-border bg-canvas px-3.5 font-mono text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
                        />
                      ) : null}

                      {field.type === "photo" ? (
                        <label className="mt-2.5 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-canvas px-4 text-sm font-semibold text-ink transition-colors hover:bg-canvas-muted">
                          <Camera className="h-5 w-5 text-utility-blue" />
                          <span className="truncate">
                            {fieldPhotoNames[field.id]
                              ? `Captured: ${fieldPhotoNames[field.id]}`
                              : "Tap to Capture Photo"}
                          </span>
                          <input
                            id={`field-${field.id}`}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) =>
                              handleFieldPhotoChange(field.id, e)
                            }
                            className="sr-only"
                          />
                        </label>
                      ) : null}
                    </div>
                  );
                })}
              </section>
            ) : null}

            {effectiveType === "url" ? (
              <section className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-utility-blue">
                  <ShieldCheck className="h-4 w-4" />
                  Verified Operational Destination
                </div>
                {safeExternalUrl ? (
                  <>
                    <p className="mt-2 break-all rounded-lg border border-border bg-canvas px-3 py-2.5 font-mono text-xs text-ink-muted">
                      {safeExternalUrl}
                    </p>
                    <a
                      href={safeExternalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-utility-blue px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Open Link
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-ink-muted">
                    {record.description || "No destination URL provided."}
                  </p>
                )}
              </section>
            ) : null}

            {effectiveType === "file" ? (
              <section className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  <FileText className="h-4 w-4" />
                  Document / Instructions
                </div>
                <div className="mt-3 whitespace-pre-wrap rounded-lg border border-border bg-canvas p-4 text-sm leading-relaxed text-ink">
                  {record.description ||
                    "No instructions added to this QR yet."}
                </div>
                {safeExternalUrl ? (
                  <a
                    href={safeExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-utility-blue px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Open File
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </section>
            ) : null}

            {effectiveType === "video_sop" || effectiveType === "paper_form" ? (
              <form
                onSubmit={handleSubmitLog}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h2 className="text-sm font-semibold text-ink">
                  Submit Inspection Log
                </h2>
                <p className="mt-0.5 text-xs text-ink-muted">
                  Zero-login sign-off — timestamped automatically.
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="worker-name"
                      className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
                    >
                      Worker Name *
                    </label>
                    <input
                      id="worker-name"
                      type="text"
                      required
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="mt-1.5 min-h-12 w-full rounded-lg border border-border bg-canvas px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Camera Photo Proof (Optional)
                    </span>
                    <label className="mt-1.5 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-canvas px-4 text-sm font-semibold text-ink transition-colors hover:bg-canvas-muted">
                      <Camera className="h-5 w-5 text-utility-blue" />
                      <span className="truncate">
                        {proofPhotoName
                          ? `Photo attached: ${proofPhotoName}`
                          : "Take Photo Proof"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleProofPhotoChange}
                        className="sr-only"
                      />
                    </label>
                    {proofPhotoPreview ? (
                      <div className="mt-2 overflow-hidden rounded-lg border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={proofPhotoPreview}
                          alt="Captured inspection proof"
                          className="max-h-40 w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="worker-notes"
                      className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
                    >
                      Notes (Optional)
                    </label>
                    <input
                      id="worker-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any defect or shift note..."
                      className="mt-1.5 min-h-12 w-full rounded-lg border border-border bg-canvas px-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
                    />
                  </div>

                  {submitError ? (
                    <div className="flex items-start gap-2 rounded-lg border border-alert-red/30 bg-alert-red/5 p-3 text-sm text-alert-red">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-action-green px-4 text-base font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting Log...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Submit Inspection Log
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : null}
          </>
        )}

        {record.show_watermark ? (
          <footer className="pt-2 pb-6">
            <Link
              href="/"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-semibold text-ink-muted transition-colors hover:border-ink hover:text-ink"
            >
              <Sparkles className="h-4 w-4 text-action-green" />
              <span>Powered by FastCC QR — Create Free Operational QRs</span>
            </Link>
          </footer>
        ) : null}
      </div>
    </main>
  );
}
