import { NextResponse } from "next/server";
import { isPaidPlanTier, PLAN_SPECS } from "@/lib/billing/constants";
import {
  buildRazorpayAuthHeader,
  getRazorpayEnv,
} from "@/lib/billing/razorpay";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

interface RazorpayOrderResponse {
  id?: string;
  amount?: number;
  currency?: string;
  error?: { description?: string };
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json(
      { error: "Supabase authentication is not configured." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Sign in before upgrading your plan." },
      { status: 401 },
    );
  }

  const razorpayEnv = getRazorpayEnv();
  if (!razorpayEnv) {
    return NextResponse.json(
      {
        error:
          "Razorpay billing is not configured yet. Set RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and NEXT_PUBLIC_RAZORPAY_KEY_ID.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const rawPlan =
    typeof body === "object" && body !== null && "plan" in body
      ? (body as { plan?: unknown }).plan
      : undefined;

  if (!isPaidPlanTier(rawPlan)) {
    return NextResponse.json(
      { error: "Invalid plan. Choose 'pro' or 'business'." },
      { status: 400 },
    );
  }

  const spec = PLAN_SPECS[rawPlan];
  const receipt = `fc_${user.id.slice(0, 8)}_${Date.now()}`;

  try {
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: buildRazorpayAuthHeader(razorpayEnv),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: spec.amountPaise,
        currency: "INR",
        receipt,
        notes: {
          app: "fastcc-qr",
          user_id: user.id,
          plan: rawPlan,
        },
      }),
    });

    const rzpJson = (await rzpRes.json()) as RazorpayOrderResponse;
    if (!rzpRes.ok || !rzpJson.id) {
      return NextResponse.json(
        {
          error:
            rzpJson.error?.description ||
            "Failed to create Razorpay checkout order.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        orderId: rzpJson.id,
        amount: rzpJson.amount ?? spec.amountPaise,
        currency: rzpJson.currency ?? "INR",
        key: razorpayEnv.publicKeyId,
        plan: rawPlan,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to reach Razorpay Orders API. Please try again." },
      { status: 502 },
    );
  }
}
