import type { SupabaseClient } from "@supabase/supabase-js";
import {
  PLAN_DURATION_DAYS,
  resolveEffectivePlan,
  type PaidPlanTier,
} from "@/lib/billing/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database, PlanTier } from "@/types/database";

export interface UserPlanStatus {
  userId: string;
  storedPlan: PlanTier;
  effectivePlan: PlanTier;
  aiSopsUsed: number;
  planExpiresAt: string | null;
}

/**
 * Reads (and lazily initializes via SECURITY DEFINER RPC) the user's plan status.
 * Falls back safely to 'free' if the billing migration has not been applied yet.
 */
export async function getUserPlanStatus(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<UserPlanStatus> {
  const defaultStatus: UserPlanStatus = {
    userId,
    storedPlan: "free",
    effectivePlan: "free",
    aiSopsUsed: 0,
    planExpiresAt: null,
  };

  try {
    const { data: ensured, error: rpcError } =
      await supabase.rpc("ensure_user_plan");

    if (!rpcError && ensured) {
      const effectivePlan = resolveEffectivePlan(
        ensured.plan,
        ensured.plan_expires_at,
      );
      return {
        userId,
        storedPlan: ensured.plan,
        effectivePlan,
        aiSopsUsed: ensured.ai_sops_used ?? 0,
        planExpiresAt: ensured.plan_expires_at ?? null,
      };
    }

    const { data: row, error: selectError } = await supabase
      .from("user_plans")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (selectError || !row) {
      return defaultStatus;
    }

    return {
      userId,
      storedPlan: row.plan,
      effectivePlan: resolveEffectivePlan(row.plan, row.plan_expires_at),
      aiSopsUsed: row.ai_sops_used ?? 0,
      planExpiresAt: row.plan_expires_at ?? null,
    };
  } catch {
    return defaultStatus;
  }
}

/**
 * Increments `ai_sops_used` securely via service-role client (preferred) or
 * the `increment_ai_sops_used` SECURITY DEFINER RPC.
 */
export async function incrementUserAiSopsUsed(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<void> {
  const admin = createAdminClient();
  if (admin) {
    const { data: existing } = await admin
      .from("user_plans")
      .select("ai_sops_used")
      .eq("user_id", userId)
      .maybeSingle();

    const nextUsed = (existing?.ai_sops_used ?? 0) + 1;
    await admin.from("user_plans").upsert(
      {
        user_id: userId,
        ai_sops_used: nextUsed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    return;
  }

  await supabase.rpc("increment_ai_sops_used");
}

/**
 * Upgrades the authenticated user's plan after Razorpay signature verification.
 */
export async function applyVerifiedPlanUpgrade(
  supabase: SupabaseClient<Database>,
  userId: string,
  params: {
    plan: PaidPlanTier;
    orderId: string;
    paymentId: string;
  },
): Promise<{ planExpiresAt: string; error: string | null }> {
  const expiresAt = new Date(
    Date.now() + PLAN_DURATION_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const admin = createAdminClient();
  if (admin) {
    const { error } = await admin.from("user_plans").upsert(
      {
        user_id: userId,
        plan: params.plan,
        razorpay_order_id: params.orderId,
        razorpay_payment_id: params.paymentId,
        plan_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    return {
      planExpiresAt: expiresAt,
      error: error ? error.message : null,
    };
  }

  const { error } = await supabase.rpc("apply_verified_razorpay_plan", {
    p_plan: params.plan,
    p_order_id: params.orderId,
    p_payment_id: params.paymentId,
    p_expires_at: expiresAt,
  });

  return {
    planExpiresAt: expiresAt,
    error: error ? error.message : null,
  };
}
