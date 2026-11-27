"use client";

import { useEffect } from "react";
import Script from "next/script";
import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Safely captures a custom analytics event without ever throwing or blocking UI.
 */
export function trackEvent(
  event: string,
  props?: Record<string, unknown>,
): void {
  try {
    if (typeof window === "undefined" || !POSTHOG_KEY) return;
    posthog.capture(event, props);
  } catch {
    // Non-blocking analytics failure.
  }
}

export function AnalyticsProvider() {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    try {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: true,
      });
    } catch {
      // Never block rendering if analytics fails to initialize.
    }
  }, []);

  if (!CLARITY_ID) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(CLARITY_ID)});`,
      }}
    />
  );
}
