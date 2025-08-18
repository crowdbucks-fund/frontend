// instrumentation.js

import { Instrumentation } from "next";

export function register() {
  // No-op for initialization
}

export const onRequestError: Instrumentation.onRequestError = async (err, request) => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getPostHogServer } = await import("./app/posthog-server");
    const posthog = getPostHogServer();

    let distinctId = null;
    if (request.headers.cookie) {
      const cookieString = request.headers.cookie.toString();
      const postHogCookieMatch = cookieString.match(
        /ph_phc_.*?_posthog=([^;]+)/
      );

      if (postHogCookieMatch && postHogCookieMatch[1]) {
        try {
          const decodedCookie = decodeURIComponent(postHogCookieMatch[1]);
          const postHogData = JSON.parse(decodedCookie);
          distinctId = postHogData.distinct_id;
        } catch (e) {
          console.error("Error parsing PostHog cookie:", e);
        }
      }
    }

    await posthog.captureExceptionImmediate(err, distinctId || undefined);
  }
};
