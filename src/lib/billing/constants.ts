import type { PlanTier } from "@/types/database";

export type PaidPlanTier = Exclude<PlanTier, "free">;

export const FREE_QR_LIMIT = 10;
export const FREE_AI_SOP_LIMIT = 1;
export const PRO_AI_SOP_LIMIT = 30;
export const PLAN_DURATION_DAYS = 30;

export interface PlanSpec {
  id: PlanTier;
  name: string;
  priceInr: number;
  amountPaise: number;
  qrLimit: number | null;
  aiSopLimit: number | null;
  watermarkRemoval: boolean;
  customLogo: boolean;
  csvExport: boolean;
}

export const PLAN_SPECS: Record<PlanTier, PlanSpec> = {
  free: {
    id: "free",
    name: "Free",
    priceInr: 0,
    amountPaise: 0,
    qrLimit: FREE_QR_LIMIT,
    aiSopLimit: FREE_AI_SOP_LIMIT,
    watermarkRemoval: false,
    customLogo: false,
    csvExport: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceInr: 999,
    amountPaise: 99900,
    qrLimit: null,
    aiSopLimit: PRO_AI_SOP_LIMIT,
    watermarkRemoval: true,
    customLogo: true,
    csvExport: true,
  },
  business: {
    id: "business",
    name: "Business",
    priceInr: 2999,
    amountPaise: 299900,
    qrLimit: null,
    aiSopLimit: null,
    watermarkRemoval: true,
    customLogo: true,
    csvExport: true,
  },
};

export function isPaidPlanTier(value: unknown): value is PaidPlanTier {
  return value === "pro" || value === "business";
}

/** Resolves the active plan tier, falling back to 'free' if expired or unknown. */
export function resolveEffectivePlan(
  plan: string | null | undefined,
  planExpiresAt: string | null | undefined,
): PlanTier {
  if (plan !== "pro" && plan !== "business") {
    return "free";
  }

  if (planExpiresAt) {
    const expiresMs = Date.parse(planExpiresAt);
    if (Number.isFinite(expiresMs) && expiresMs <= Date.now()) {
      return "free";
    }
  }

  return plan;
}

export function isPaidPlan(plan: PlanTier): boolean {
  return plan === "pro" || plan === "business";
}

export function getAiSopLimit(plan: PlanTier): number | null {
  return PLAN_SPECS[plan].aiSopLimit;
}

export function getQrLimit(plan: PlanTier): number | null {
  return PLAN_SPECS[plan].qrLimit;
}
