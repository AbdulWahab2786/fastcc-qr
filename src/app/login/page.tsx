import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

async function LoginGate() {
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
      redirect("/dashboard");
    }
  }

  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md animate-pulse rounded-xl border border-border bg-surface" />
        }
      >
        <LoginGate />
      </Suspense>
    </main>
  );
}
