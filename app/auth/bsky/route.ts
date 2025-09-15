import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createBskyOauthClient } from "app/auth/bsky/client";
import { captureException } from 'app/posthog-server';
import { appendSignedCookie } from 'lib/cookies';
import invariant from 'lib/invariant';
import { NextRequest, NextResponse } from 'next/server';
import { joinURL, stringifyParsedURL, withQuery } from 'ufo';

export async function GET(request: NextRequest) {
  const instance = request.nextUrl.searchParams.get('instance');
  try {
    invariant(!!instance, "Instance is not provided");
    const redirectUrlAfterLogin = request.nextUrl.searchParams.get('redirect_url');
    const authClient = await createBskyOauthClient()
    const instanceUrl = stringifyParsedURL({
      protocol: "https:",
      host: instance,
    })
    const response = NextResponse.redirect((await authClient.authorize(instanceUrl)).toString());
    if (redirectUrlAfterLogin)
      await appendSignedCookie(response, 'redirect_url', {
        redirectUrl: redirectUrlAfterLogin
      }, false);
    return response
  } catch (error: any) {
    getCloudflareContext().ctx.waitUntil(captureException(error, request))
    const message = 'Something went wrong, please try again later.';
    const redirectResponse = NextResponse.redirect(
      joinURL(request.nextUrl.origin, withQuery('/auth', { error: message, step: 'bsky' })),
      302
    );
    if (instance)
      await appendSignedCookie(redirectResponse, 'oauth_state', {
        instance,
        platform: 'bsky'
      });
    return redirectResponse;
  }
}
