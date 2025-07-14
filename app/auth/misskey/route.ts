import { getRedirectUrl } from 'app/auth/utils';
import { serialize } from 'cookie-es';
import { encryptCookie } from 'lib/cookies';
import { headers } from "next/headers";
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from "next/server";
import { platformInfo } from "platform";
import invariant from "tiny-invariant";
import { joinURL, stringifyParsedURL, withQuery } from "ufo";

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
      "misskey"
    );

    // redirect to the OAuth URL
    const session = crypto.randomUUID();
    const oauthUrl = withQuery(joinURL(instanceUrl, `/miauth/${session}`), {
      name: platformInfo.name,
      callback: callbackUrl,
      permission: 'read:account',
    });

    const response = NextResponse.redirect(oauthUrl, 302);
    response.headers.append("Set-Cookie",
      serialize('oauth_state', await encryptCookie({ instance }), {
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
    return redirect(withQuery('/auth', { error: error.message, step: 'misskey' }))
  }
}
