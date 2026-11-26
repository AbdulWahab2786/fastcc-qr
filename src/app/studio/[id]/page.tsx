import { Suspense } from "react";
import { StudioClient } from "@/components/StudioClient";
import { getUserPlanStatus } from "@/lib/billing/plans";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { PlanTier } from "@/types/database";
import { isUuid, type QrCodeRow } from "@/types/qr";

interface StudioPageProps {
  params: Promise<{ id: string }>;
}

function normalizeRouteId(rawId: string): string {
  try {
    return decodeURIComponent(rawId).trim();
  } catch {
    return rawId.trim();
  }
}

async function loadQrRecord(rawId: string): Promise<QrCodeRow | null> {
  const cleanId = normalizeRouteId(rawId);
  if (!cleanId || !hasSupabaseEnv()) return null;

  try {
    const supabase = await createClient();
    const query = supabase.from("qr_codes").select("*");
    const { data, error } = isUuid(cleanId)
      ? await query.eq("id", cleanId).maybeSingle()
      : await query.eq("short_code", cleanId).maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

async function StudioContent({ params }: StudioPageProps) {
  const { id } = await params;
  const cleanId = normalizeRouteId(id);
  const supabaseConfigured = hasSupabaseEnv();
  const initialRecord = await loadQrRecord(cleanId);

  let isAuthenticated = false;
  let userPlan: PlanTier | null = null;
  let currentUserId: string | null = null;
  if (supabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        isAuthenticated = true;
        currentUserId = user.id;
        const planStatus = await getUserPlanStatus(supabase, user.id);
        userPlan = planStatus.effectivePlan;
      }
    } catch {
      isAuthenticated = false;
      userPlan = null;
      currentUserId = null;
    }
  }

  return (
    <StudioClient
      routeId={cleanId}
      initialRecord={initialRecord}
      supabaseConfigured={supabaseConfigured}
      isAuthenticated={isAuthenticated}
      userPlan={userPlan}
      currentUserId={currentUserId}
    />
  );
}

export default function StudioPage({ params }: StudioPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
        </div>
      }
    >
      <StudioContent params={params} />
    </Suspense>
  );
}
