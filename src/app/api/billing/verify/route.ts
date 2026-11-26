import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isPaidPlanTier, PLAN_SPECS } from "@/lib/billing/constants";
import { applyVerifiedPlanUpgrade } from "@/lib/billing/plans";
import {
  buildRazorpayAuthHeader,
  getRazorpayEnv,
} from "@/lib/billing/razorpay";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

interface VerifyRequestBody {
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
  plan?: unknown;
}

interface RazorpayOrderLookup {
  id?: string;
  amount?: number;
  notes?: Record<string, string>;
}

function timingSafeHexEqual(expected: string, received: string): boolean {
  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(received, "utf8");
  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
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
      { error: "Sign in to verify your payment." },
      { status: 401 },
    );
  }

  const razorpayEnv = getRazorpayEnv();
  if (!razorpayEnv) {
    return NextResponse.json(
      {
        error:
          "Razorpay billing is not configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
      },
      { status: 503 },
    );
  }

  let rawBody: VerifyRequestBody;
  try {
    rawBody = (await request.json()) as VerifyRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const orderId =
    typeof rawBody.razorpay_order_id === "string"
      ? rawBody.razorpay_order_id.trim()
      : "";
  const paymentId =
    typeof rawBody.razorpay_payment_id === "string"
      ? rawBody.razorpay_payment_id.trim()
      : "";
  const signature =
    typeof rawBody.razorpay_signature === "string"
      ? rawBody.razorpay_signature.trim()
      : "";
  const requestedPlan = rawBody.plan;

  if (!orderId || !paymentId || !signature || !isPaidPlanTier(requestedPlan)) {
    return NextResponse.json(
      {
        error:
          "Missing or invalid razorpay_order_id, razorpay_payment_id, razorpay_signature, or plan.",
      },
      { status: 400 },
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", razorpayEnv.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (!timingSafeHexEqual(expectedSignature, signature)) {
    return NextResponse.json(
      { error: "Razorpay payment signature verification failed." },
      { status: 400 },
    );
  }

  // Confirm order ownership & paid plan from Razorpay Orders API so a Pro order cannot unlock Business.
  let verifiedPlan = requestedPlan;
  try {
    const orderRes = await fetch(
      `https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`,
      {
        headers: {
          Authorization: buildRazorpayAuthHeader(razorpayEnv),
        },
      },
    );

    if (!orderRes.ok) {
      return NextResponse.json(
        { error: "Could not verify Razorpay order details." },
        { status: 502 },
      );
    }

    const orderData = (await orderRes.json()) as RazorpayOrderLookup;
    const orderUserId = orderData.notes?.user_id;
    const orderPlan = orderData.notes?.plan;

    if (orderUserId && orderUserId !== user.id) {
      return NextResponse.json(
        { error: "Order does not belong to the signed-in account." },
        { status: 403 },
      );
    }

    if (isPaidPlanTier(orderPlan)) {
      verifiedPlan = orderPlan;
    }

    const expectedAmount = PLAN_SPECS[verifiedPlan].amountPaise;
    if (
      typeof orderData.amount === "number" &&
      orderData.amount < expectedAmount
    ) {
      return NextResponse.json(
        { error: "Paid amount does not match the selected plan." },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Unable to confirm Razorpay order with Razorpay API." },
      { status: 502 },
    );
  }

  const { planExpiresAt, error: upgradeError } = await applyVerifiedPlanUpgrade(
    supabase,
    user.id,
    {
      plan: verifiedPlan,
      orderId,
      paymentId,
    },
  );

  if (upgradeError) {
    return NextResponse.json(
      { error: `Payment verified, but failed to update plan: ${upgradeError}` },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      plan: verifiedPlan,
      planExpiresAt,
    },
    { status: 200 },
  );
}
