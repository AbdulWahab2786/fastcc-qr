import Link from "next/link";

export function Footer() {
  return (
    <footer
      id="compare"
      className="no-print mt-auto border-t border-border bg-surface print:hidden"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fastcc-logo.png"
                alt="FastCC QR"
                width={24}
                height={24}
                className="h-6 w-6 rounded border border-border bg-white object-contain p-0.5"
              />
              <span className="text-sm font-semibold text-ink">FastCC QR</span>
              <span className="rounded border border-border bg-canvas-muted px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
                Operations
              </span>
            </div>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-ink-muted">
              Built as an AI-first CaoLiao QR alternative for SMB shop floors:
              instant permanent QR labels, multilingual SOPs, and frontline
              inspection logs without enterprise bloat.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">
              Product
            </h3>
            <ul className="mt-2.5 space-y-2 text-xs text-ink-muted">
              <li>
                <Link href="/templates" className="hover:text-ink hover:underline">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/studio/demo" className="hover:text-ink hover:underline">
                  Label Studio
                </Link>
              </li>
              <li>
                <Link href="/q/demo" className="hover:text-ink hover:underline">
                  Worker View
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-ink hover:underline">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink">
              Compare
            </h3>
            <ul className="mt-2.5 space-y-2 text-xs text-ink-muted">
              <li>
                <Link href="/compare/sopx" className="hover:text-ink hover:underline">
                  FastCC QR vs. SOPX
                </Link>
              </li>
              <li>
                <Link href="/compare/clappia" className="hover:text-ink hover:underline">
                  FastCC QR vs. Clappia
                </Link>
              </li>
              <li>
                <Link href="/compare/uniqode" className="hover:text-ink hover:underline">
                  FastCC QR vs. Uniqode
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
