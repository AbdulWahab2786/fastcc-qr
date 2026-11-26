import Link from "next/link";

export function Navbar() {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur print:hidden">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink transition-opacity hover:opacity-90"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="FastCC QR"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg border border-border object-cover"
          />
          <span className="text-base font-semibold tracking-tight">
            FastCC QR
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-1 sm:gap-2"
        >
          <Link
            href="/#templates"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink"
          >
            Templates
          </Link>
          <Link
            href="/studio/demo"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink"
          >
            Studio
          </Link>
          <Link
            href="/#compare"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink"
          >
            Compare
          </Link>
        </nav>
      </div>
    </header>
  );
}
