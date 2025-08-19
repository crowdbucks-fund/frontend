import { getCloudflareContext } from "@opennextjs/cloudflare";
import { deleteOauthStateCookie, getInstanceCredentials, getRedirectUrl, serializeOauthStateCookie } from "app/auth/utils";
import { captureException } from "app/posthog-server";
import invariant from "lib/invariant";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { joinURL, stringifyParsedURL } from "ufo";


export async function POST(req: Request) {
  try {
    const data = await req.json() as { code: string };
    const callbackUrl = getRedirectUrl(
      await headers(),
      '/auth',
      "mastodon"
    );
    const cookieOAuthState = await serializeOauthStateCookie()
    const { instance, } = cookieOAuthState;
    invariant(!!instance, "Invalid oauth state", {
      data,
      cookieOAuthState
    });
    await deleteOauthStateCookie()

    const credentials = await getInstanceCredentials(instance, callbackUrl);
    invariant(credentials, "Mastodon o-auth verification failed, please try again later.", {
      cookieOAuthState,
      instance,
      callbackUrl,
      data,
    });

    const { client_id: clientId, client_secret: clientSecret } = credentials;

    const instanceUrl = stringifyParsedURL({
      protocol: "https:",
      host: instance,
    })
    const response = await fetch(
      joinURL(instanceUrl, '/oauth/token'),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
          code: data.code,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify OAuth state, please try again.", {
        cause: {
          instance,
          instanceUrl,
          callbackUrl,
          code: data.code,
        }
      });
    }

    const token = await response.json() as { access_token: string };
    return NextResponse.json({
      token: token.access_token,
      instance,
    })
  } catch (error: any) {
    getCloudflareContext().ctx.waitUntil(captureException(error, req))

    error.message = error.message.replace('Invariant failed: ', '').trim();
    if (!error.message)
      error.message = 'Something went wrong, please try again later.';

    return NextResponse.json({ error: error.message }, {
      status: 400
    });
  }
}
