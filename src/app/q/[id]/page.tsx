import { Suspense } from "react";
import Link from "next/link";
import { ClipboardCheck, AlertTriangle } from "lucide-react";

interface WorkerQrPageProps {
  params: Promise<{ id: string }>;
}

async function WorkerQrContent({ params }: WorkerQrPageProps) {
  const { id } = await params;
  const shortCode = id;

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-4 py-8">
        <header className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-action-green">
              <ClipboardCheck className="h-4 w-4" />
              Frontline SOP
            </span>
            <span className="rounded bg-canvas-muted px-2 py-0.5 font-mono text-xs text-ink-muted">
              {shortCode}
            </span>
          </div>
          <h1 className="mt-2 text-xl font-semibold">
            Equipment Check &amp; Log
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Placeholder worker view mapped to{" "}
            <code className="rounded bg-canvas-muted px-1.5 py-0.5 font-mono text-xs text-ink">
              short_code={shortCode}
            </code>
            .
          </p>
        </header>

        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-start gap-2.5 rounded-lg border border-alert-red/30 bg-alert-red/5 p-3 text-sm text-alert-red">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Interactive checklist and inspection submission will be wired in
              Phase 2.
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              className="min-h-12 rounded-lg bg-action-green px-4 text-sm font-semibold text-white opacity-60"
            >
              Pass
            </button>
            <button
              type="button"
              disabled
              className="min-h-12 rounded-lg bg-alert-red px-4 text-sm font-semibold text-white opacity-60"
            >
              Report Issue
            </button>
          </div>
        </section>

        <footer className="text-center text-xs text-ink-muted">
          <Link href="/" className="text-utility-blue hover:underline">
            Powered by FastCC QR
          </Link>
        </footer>
      </div>
    </main>
  );
}

export default function WorkerQrPage({ params }: WorkerQrPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <WorkerQrContent params={params} />
    </Suspense>
  );
}
