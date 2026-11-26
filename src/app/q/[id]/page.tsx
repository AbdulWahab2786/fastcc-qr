import { Suspense } from "react";
import { WorkerScanClient } from "@/components/WorkerScanClient";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isUuid, type QrCodeRow, type SopStepRow } from "@/types/qr";

interface WorkerQrPageProps {
  params: Promise<{ id: string }>;
}

async function loadWorkerQrData(id: string): Promise<{
  record: QrCodeRow | null;
  steps: SopStepRow[];
}> {
  if (!hasSupabaseEnv()) {
    return { record: null, steps: [] };
  }

  try {
    const supabase = await createClient();
    const query = supabase.from("qr_codes").select("*");
    const { data: qrRow, error: qrError } = isUuid(id)
      ? await query.eq("id", id).maybeSingle()
      : await query.eq("short_code", id).maybeSingle();

    if (qrError || !qrRow) {
      return { record: null, steps: [] };
    }

    const { data: stepRows, error: stepsError } = await supabase
      .from("sop_steps")
      .select("*")
      .eq("qr_code_id", qrRow.id)
      .order("step_order", { ascending: true });

    return {
      record: qrRow,
      steps: !stepsError && stepRows ? stepRows : [],
    };
  } catch {
    return { record: null, steps: [] };
  }
}

async function WorkerQrContent({ params }: WorkerQrPageProps) {
  const { id } = await params;
  const supabaseConfigured = hasSupabaseEnv();
  const { record, steps } = await loadWorkerQrData(id);

  return (
    <WorkerScanClient
      routeId={id}
      initialRecord={record}
      initialSteps={steps}
      supabaseConfigured={supabaseConfigured}
    />
  );
}

export default function WorkerQrPage({ params }: WorkerQrPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-8">
          <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
        </div>
      }
    >
      <WorkerQrContent params={params} />
    </Suspense>
  );
}
