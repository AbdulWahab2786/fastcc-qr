import { Suspense } from "react";
import Link from "next/link";
import { SignOutButton } from "@/components/NavbarAuthControls";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

async function NavbarAuth() {
  let isLoggedIn = false;

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isLoggedIn = Boolean(user);
    } catch {
      isLoggedIn = false;
    }
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/dashboard"
          className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-surface transition-opacity hover:opacity-90"
        >
          Dashboard
        </Link>
        <SignOutButton />
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-canvas-muted"
    >
      Sign In
    </Link>
  );
}

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
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink sm:inline-flex"
          >
            Templates
          </Link>
          <Link
            href="/studio/demo"
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink sm:inline-flex"
          >
            Studio
          </Link>
          <Link
            href="/#compare"
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-muted hover:text-ink md:inline-flex"
          >
            Compare
          </Link>
          <Suspense
            fallback={
              <div className="h-8 w-20 animate-pulse rounded-md bg-canvas-muted" />
            }
          >
            <NavbarAuth />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
