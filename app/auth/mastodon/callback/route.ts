import { deleteOauthStateCookie, getInstanceCredentials, getRedirectUrl, serializeOauthStateCookie } from "app/auth/utils";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import invariant from "tiny-invariant";
import { joinURL, stringifyParsedURL } from "ufo";


export async function POST(req: Request) {
  try {
    const data = await req.json() as { code: string };
    const callbackUrl = getRedirectUrl(
      await headers(),
      '/auth',
      "mastodon"
    );
    const { instance, } = await serializeOauthStateCookie()
    invariant(!!instance, "Invalid oauth state");
    await deleteOauthStateCookie()

    const credentials = await getInstanceCredentials(instance, callbackUrl);
    invariant(credentials, "Something went wrong, please try again later.");

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
      throw new Error("Failed to verify OAuth state, please try again.");
    }

    const token = await response.json() as { access_token: string };
    return NextResponse.json({
      token: token.access_token,
      instance,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, {
      status: 400
    });
  }
}
