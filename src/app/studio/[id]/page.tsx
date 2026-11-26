import { Suspense } from "react";
import { StudioClient } from "@/components/StudioClient";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isUuid, type QrCodeRow } from "@/types/qr";

interface StudioPageProps {
  params: Promise<{ id: string }>;
}

async function loadQrRecord(id: string): Promise<QrCodeRow | null> {
  if (!hasSupabaseEnv()) return null;

  try {
    const supabase = await createClient();
    const query = supabase.from("qr_codes").select("*");
    const { data, error } = isUuid(id)
      ? await query.eq("id", id).maybeSingle()
      : await query.eq("short_code", id).maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

async function StudioContent({ params }: StudioPageProps) {
  const { id } = await params;
  const supabaseConfigured = hasSupabaseEnv();
  const initialRecord = await loadQrRecord(id);

  return (
    <StudioClient
      routeId={id}
      initialRecord={initialRecord}
      supabaseConfigured={supabaseConfigured}
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
