import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

function getSafeNextPath(rawNext: string | undefined): string {
  if (!rawNext) return "/dashboard";
  if (rawNext.startsWith("/") && !rawNext.startsWith("//")) {
    return rawNext;
  }
  return "/dashboard";
}

async function LoginGate({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = getSafeNextPath(next);

  if (hasSupabaseEnv()) {
    let isAuthenticated = false;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isAuthenticated = Boolean(user);
    } catch {
      isAuthenticated = false;
    }

    if (isAuthenticated) {
      redirect(nextPath);
    }
  }

  return <LoginForm nextPath={nextPath} />;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md animate-pulse rounded-xl border border-border bg-surface" />
        }
      >
        <LoginGate searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
