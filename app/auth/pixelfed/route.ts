import { serialize } from 'cookie-es';
import { encryptCookie } from 'lib/cookies';
import { headers } from "next/headers";
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from "next/server";
import { platformInfo } from "platform";
import invariant from "tiny-invariant";
import { joinURL, stringifyParsedURL, withQuery } from "ufo";
import { getRedirectUrl } from "../utils";

export async function GET(request: NextRequest) {
  try {
    const instance = request.nextUrl.searchParams.get('instance');
    invariant(!!instance, "Instance is not provided");

    const instanceUrl = stringifyParsedURL({
      protocol: "https:",
      host: instance,
    })
    // get instance from the request body
    const callbackUrl = getRedirectUrl(
      await headers(),
      process.env.OAUTH_REDIRECT!,
      "pixelfed"
    );
    // register app
    const { client_id: clientId, client_secret: clientSecret } = await fetch(joinURL(instanceUrl, "api/v1/apps"), {
      method: "POST",
      body: JSON.stringify({
        client_name: `${platformInfo.name}`,
        redirect_uris: callbackUrl,
        scopes: 'read',
        website: platformInfo.url,
      }),
      headers: {
        "Content-Type": "application/json",
        accept: 'application/json',
      },
    }).then((res) => res.json()).catch(() => { throw new Error('Something went wrong, please try again later.') });
    invariant(!!clientId && !!clientSecret, "Something went wrong, please try again later.");

    // redirect to the OAuth URL
    const oauthUrl = withQuery(joinURL(instanceUrl, "oauth/authorize"), {
      response_type: "code",
      client_id: clientId,
      redirect_uri: callbackUrl,
      scope: 'read',
    });


    const response = NextResponse.redirect(oauthUrl, 302);
    response.headers.append("Set-Cookie",
      serialize('oauth_state', await encryptCookie({ instance, clientId, clientSecret }), {
        path: '/',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
      }),
    );
    return response;
  } catch (error: any) {
    console.error(error);
    if (request.headers.get('accept')?.includes('application/json')) {
      return NextResponse.json({ error: error.message }, {
        status: 400
      });
    }
    return redirect(withQuery('/auth', { error: error.message }))
  }
}
