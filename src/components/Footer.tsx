import Link from "next/link";

export function Footer() {
  return (
    <footer
      id="compare"
      className="no-print mt-auto border-t border-border bg-surface print:hidden"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink">FastCC QR</span>
              <span className="rounded border border-border bg-canvas-muted px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                Compare
              </span>
            </div>
            <p className="mt-1 max-w-xl text-xs text-ink-muted">
              Built as an AI-first CaoLiao QR alternative for SMB shop floors:
              instant permanent QR labels, multilingual SOPs, and frontline
              inspection logs without enterprise bloat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
            <Link href="/#templates" className="hover:text-ink hover:underline">
              Templates
            </Link>
            <Link href="/studio/demo" className="hover:text-ink hover:underline">
              Label Studio
            </Link>
            <Link href="/q/demo" className="hover:text-ink hover:underline">
              Worker View
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
