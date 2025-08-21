
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest } from "next/server";
import { PostHog } from "posthog-node";


let posthogInstance: PostHog = null!;
export function getPostHogServer() {
  if (!posthogInstance) {
    posthogInstance = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogInstance;
}

export const captureException = async (err: unknown, request?: NextRequest | Request) => {
  const posthog = getPostHogServer();
  const cookie = request?.headers?.get?.("cookie");
  let distinctId = null;
  if (cookie) {
    const postHogCookieMatch = cookie.match(/ph_phc_.*?_posthog=([^;]+)/);
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

  await posthog.captureExceptionImmediate(
    err,
    distinctId || undefined,
    (err as Error).cause || undefined
  )

  // temporary fix to ensure the request is not closed before the error is captured
  // this is needed because the PostHog Node SDK async captureException is not working fine
  getCloudflareContext().ctx.waitUntil(new Promise(resolve => setTimeout(resolve, 1000)))
};
