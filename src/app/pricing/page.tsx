import { Suspense } from "react";
import type { Metadata } from "next";
import { PricingClient } from "@/components/PricingClient";
import { getUserPlanStatus } from "@/lib/billing/plans";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { PlanTier } from "@/types/database";

export const metadata: Metadata = {
  title: "Pricing — FastCC QR",
  description:
    "Transparent INR pricing for industrial QR SOPs, live GPS photo proof, 5-language worker checklists, A4 sticker sheets, and FSSAI/ISO audit PDF exports.",
};

async function PricingContent() {
  let isAuthenticated = false;
  let currentPlan: PlanTier = "free";
  let userEmail = "";

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        isAuthenticated = true;
        userEmail = user.email ?? "";
        const status = await getUserPlanStatus(supabase, user.id);
        currentPlan = status.effectivePlan;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  return (
    <PricingClient
      isAuthenticated={isAuthenticated}
      currentPlan={currentPlan}
      userEmail={userEmail}
    />
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mx-auto h-16 max-w-md animate-pulse rounded-lg bg-canvas-muted" />
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
            <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
            <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
          </div>
        </main>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
