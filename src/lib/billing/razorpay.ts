export interface RazorpayEnv {
  keyId: string;
  keySecret: string;
  publicKeyId: string;
}

/**
 * Reads Razorpay server credentials cleanly on the server.
 * Returns null if required keys are missing so routes can return a clean JSON error.
 */
export function getRazorpayEnv(): RazorpayEnv | null {
  if (typeof window !== "undefined") {
    throw new Error("getRazorpayEnv must only be called on the server.");
  }

  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const publicKeyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || keyId;

  if (!keyId || !keySecret || !publicKeyId) {
    return null;
  }

  return { keyId, keySecret, publicKeyId };
}

export function buildRazorpayAuthHeader(env: RazorpayEnv): string {
  const token = Buffer.from(`${env.keyId}:${env.keySecret}`).toString("base64");
  return `Basic ${token}`;
}
