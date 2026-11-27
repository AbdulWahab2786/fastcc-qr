import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { DashboardClient } from "@/components/DashboardClient";
import { getUserPlanStatus } from "@/lib/billing/plans";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { InspectionLogRow, QrCodeRow } from "@/types/qr";

interface DashboardPageProps {
  searchParams: Promise<{ upgraded?: string }>;
}

async function DashboardContent({ searchParams }: DashboardPageProps) {
  await connection();
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const { upgraded } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const [planStatus, { data: qrRows }] = await Promise.all([
    getUserPlanStatus(supabase, user.id),
    supabase
      .from("qr_codes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const qrCodes: QrCodeRow[] = qrRows ?? [];
  const qrIds = qrCodes.map((qr) => qr.id);

  let logs: InspectionLogRow[] = [];
  if (qrIds.length > 0) {
    const { data: logRows } = await supabase
      .from("inspection_logs")
      .select("*")
      .in("qr_code_id", qrIds)
      .order("created_at", { ascending: false })
      .limit(200);

    logs = logRows ?? [];
  }

  return (
    <DashboardClient
      userEmail={user.email ?? ""}
      initialQrCodes={qrCodes}
      initialLogs={logs}
      plan={planStatus.effectivePlan}
      aiSopsUsed={planStatus.aiSopsUsed}
      planExpiresAt={planStatus.planExpiresAt}
      justUpgraded={upgraded === "true"}
    />
  );
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="mb-6 h-10 w-64 animate-pulse rounded-lg bg-canvas-muted" />
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-28 animate-pulse rounded-xl border border-border bg-surface" />
            <div className="h-28 animate-pulse rounded-xl border border-border bg-surface" />
            <div className="h-28 animate-pulse rounded-xl border border-border bg-surface" />
            <div className="h-28 animate-pulse rounded-xl border border-border bg-surface" />
          </div>
          <div className="h-72 animate-pulse rounded-xl border border-border bg-surface" />
        </main>
      }
    >
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}
