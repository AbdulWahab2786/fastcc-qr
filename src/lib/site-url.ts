export function getSiteBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://fastcc-qr.vercel.app";
  return raw.replace(/\/+$/, "");
}
