/** @type {import('posthog-node').PostHog | undefined} */
/**
 * @typedef {import('posthog-node').PostHog} PostHog
 * @typedef {import('http').IncomingMessage | Request} AnyRequest
 */
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PostHog } from "posthog-node";
let posthogInstance = null;

/**
 * @returns {import('posthog-node').PostHog}
 */
export function getPostHogServer() {
  if (!posthogInstance) {
    posthogInstance = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0, // Because server-side functions in Next.js can be short-lived we flush regularly
    });
  }
  return posthogInstance;
}

/**
 * Capture an exception and send it to PostHog (only on Node.js runtime).
 * @param {unknown} err - The error or exception to capture.
 * @param {AnyRequest} request - The incoming request object.
 * @returns {Promise<void>}
 */
export const captureException = async (err, request) => {
  // if (process.env.NEXT_RUNTIME === "nodejs") {
  const posthog = await getPostHogServer();
  const cookie = request.headers.cookie || request.headers?.get?.("cookie");
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
  getCloudflareContext().ctx.waitUntil(
    posthog.captureExceptionImmediate(err, distinctId || undefined, err.cause)
  );
  // }
};
