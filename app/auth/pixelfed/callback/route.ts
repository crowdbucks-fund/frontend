import { getRedirectUrl, serializeOauthStateCookie } from "app/auth/utils";
import { headers } from "next/headers";
import invariant from "tiny-invariant";
import { joinURL, stringifyParsedURL } from "ufo";

export async function POST(req: Request) {
  const data = await req.json();
  const callbackUrl = getRedirectUrl(
    await headers(),
    process.env.OAUTH_REDIRECT!,
    "pixelfed"
  );
  const { instance, clientId, clientSecret } = await serializeOauthStateCookie()
  invariant(!!instance && !!clientId && !!clientSecret, "Invalid oauth state");

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
  const token = await response.json();

  const userResponse = await fetch(
    joinURL(instanceUrl, `/api/v1/accounts/verify_credentials`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
    })
  return new Response(JSON.stringify(await userResponse.json()), {
    status: 200
  })
}
