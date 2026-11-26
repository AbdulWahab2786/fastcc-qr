import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/DashboardClient";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { InspectionLogRow, QrCodeRow } from "@/types/qr";

async function DashboardContent() {
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: qrRows } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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
    />
  );
}

export default function DashboardPage() {
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
      <DashboardContent />
    </Suspense>
  );
}
