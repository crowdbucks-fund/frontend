import { getRedirectUrl } from 'app/auth/utils';
import { serialize } from 'cookie-es';
import { encryptCookie } from "lib/cookies";
import { headers } from "next/headers";
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from "next/server";
import { platformInfo } from "platform";
import invariant from "tiny-invariant";
import { joinURL, stringifyParsedURL, withQuery } from "ufo";

export async function GET(request: NextRequest, res: NextResponse) {
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
      "mastodon"
    );

    // register app
    const { client_id: clientId, client_secret: clientSecret } = await fetch(joinURL(instanceUrl, "api/v1/apps"), {
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
        return await res.json();
      throw await res.json();
    }).catch((error) => {
      console.error(error)
      throw new Error('Something went wrong, please try again later.')
    });
    console.log(clientId, clientSecret)
    invariant(!!clientId && !!clientSecret, "Something went wrong, please try again later.");

    // redirect to the OAuth URL
    const oauthUrl = withQuery(joinURL(instanceUrl, "oauth/authorize"), {
      response_type: "code",
      client_id: clientId,
      redirect_uri: callbackUrl,
      scope: 'profile',
    });

    const response = NextResponse.redirect(oauthUrl, 302);
    response.headers.append("Set-Cookie",
      serialize('oauth_state', await encryptCookie({
        instance,
        clientId,
        clientSecret,
      }), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
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
    return redirect(withQuery('/auth', { error: error.message, step: 'mastodon' }))
  }
}
