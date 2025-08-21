import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getInstanceCredentials, getRedirectUrl, storeInstanceCredentials } from 'app/auth/utils';
import { captureException } from 'app/posthog-server';
import { serialize } from 'cookie-es';
import { encryptCookie } from "lib/cookies";
import invariant from 'lib/invariant';
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { platformInfo } from "platform";
import { joinURL, stringifyParsedURL, withQuery } from "ufo";


const appendCookie = async (response: NextResponse, name: string, data: Object) => {
  response.headers.append("Set-Cookie",
    serialize(name, await encryptCookie(data), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }),
  );
}


export async function GET(request: NextRequest, res: NextResponse) {
  try {
    const instance = request.nextUrl.searchParams.get('instance');
    invariant(!!instance, "Instance is not provided");
    const redirectUrlAfterLogin = request.nextUrl.searchParams.get('redirect_url');

    const instanceUrl = stringifyParsedURL({
      protocol: "https:",
      host: instance,
    })
    // get instance from the request body
    const callbackUrl = getRedirectUrl(
      await headers(),
      '/auth',
      "mastodon"
    );

    const credentials = await getInstanceCredentials(instance, callbackUrl);
    let clientId, clientSecret;
    if (!credentials) {
      // register app
      const credentials = await fetch(joinURL(instanceUrl, "api/v1/apps"), {
        method: "POST",
        body: JSON.stringify({
          client_name: `${platformInfo.name} (${platformInfo.url})`,
          redirect_uris: [callbackUrl],
          scopes: 'profile',
          website: platformInfo.url,
        }),
        headers: {
          "Content-Type": "application/json",
          accept: 'application/json',
        },
      }).then(async (res) => {
        if (res.ok)
          return await res.json() as { client_id: string, client_secret: string };
        throw await res.json();
      }).catch(() => {
        throw new Error(`Something went wrong in connecting to "${instance}" instance, please try again later.`, {
          cause: {
            instance,
            instanceUrl,
            callbackUrl
          }
        })
      });
      invariant(!!credentials.client_id && !!credentials.client_secret, "Something went wrong, please try again later.", {
        instance,
        instanceUrl,
        callbackUrl,
        credentials
      });
      await storeInstanceCredentials(instance, callbackUrl, { client_id: credentials.client_id, client_secret: credentials.client_secret })
      clientId = credentials.client_id;
      clientSecret = credentials.client_secret;
    } else {
      clientId = credentials.client_id;
      clientSecret = credentials.client_secret;
    }

    invariant(!!clientId && !!clientSecret, "Instance negotiation failed. Please try again later.", {
      instance,
      instanceUrl,
      clientId,
      clientSecret,
      callbackUrl,
    });

    // redirect to the OAuth URL
    const oauthUrl = withQuery(joinURL(instanceUrl, "oauth/authorize"), {
      response_type: "code",
      client_id: clientId,
      redirect_uri: callbackUrl,
      scope: 'profile',
    });

    const response = NextResponse.redirect(oauthUrl, 302);
    await appendCookie(response, 'oauth_state', {
      instance
    });
    await appendCookie(response, 'redirect_url', {
      redirectUrl: redirectUrlAfterLogin
    });
    return response;
  } catch (error: any) {
    getCloudflareContext().ctx.waitUntil(captureException(error, request))

    error.message = error.message.replace('Invariant failed: ', '').trim();
    if (!error.message)
      error.message = 'Something went wrong, please try again later.';
    if (request.headers.get('accept')?.includes('application/json')) {
      return NextResponse.json({ error: error.message }, {
        status: 400
      });
    }
    const redirectResponse = NextResponse.redirect(
      joinURL(request.nextUrl.origin, withQuery('/auth', { error: error.message, step: 'mastodon' })),
      302
    );
    await appendCookie(redirectResponse, 'oauth_state', {
      instance: request.nextUrl.searchParams.get('instance')
    });
    return redirectResponse;
  }
}
