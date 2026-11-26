import { Suspense } from "react";
import { StudioClient } from "@/components/StudioClient";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
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
  if (supabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isAuthenticated = Boolean(user);
    } catch {
      isAuthenticated = false;
    }
  }

  return (
    <StudioClient
      routeId={cleanId}
      initialRecord={initialRecord}
      supabaseConfigured={supabaseConfigured}
      isAuthenticated={isAuthenticated}
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
