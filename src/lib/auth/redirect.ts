/**
 * Sanitizes a post-authentication redirect path so redirects stay on-origin.
 */
export function getSafeNextPath(
  rawNext: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!rawNext) {
    return fallback;
  }
  if (rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.startsWith("/\\")) {
    return rawNext;
  }
  return fallback;
}
