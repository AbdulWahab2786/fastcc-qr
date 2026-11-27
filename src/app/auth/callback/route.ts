import { NextResponse, type NextRequest } from "next/server";
import { getSafeNextPath } from "@/lib/auth/redirect";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles Supabase OAuth & PKCE callback redirects by exchanging the auth code for a session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const oauthError = searchParams.get("error_description") ?? searchParams.get("error");

  if (oauthError) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", oauthError);
    return NextResponse.redirect(loginUrl);
  }

  if (code && hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv || !forwardedHost) {
          return NextResponse.redirect(`${origin}${nextPath}`);
        }
        return NextResponse.redirect(`https://${forwardedHost}${nextPath}`);
      }
    } catch {
      // Fall through to error redirect when session exchange fails.
    }
  }

  const fallbackUrl = new URL("/login", origin);
  fallbackUrl.searchParams.set(
    "error",
    "Could not complete authentication. Please try again.",
  );
  return NextResponse.redirect(fallbackUrl);
}
