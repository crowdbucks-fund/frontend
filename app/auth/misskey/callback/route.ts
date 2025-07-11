import { serializeOauthStateCookie } from "app/auth/utils";
import invariant from "tiny-invariant";
import { joinURL, stringifyParsedURL } from "ufo";

export async function POST(req: Request) {
  const data = await req.json();

  const { instance } = await serializeOauthStateCookie()
  invariant(!!instance, "Invalid oauth state");


  const instanceUrl = stringifyParsedURL({
    protocol: "https:",
    host: instance,
  })

  const response = await fetch(
    joinURL(instanceUrl, `/api/miauth/${data.session}/check`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to verify OAuth state, please try again.");
  }
  const { token } = await response.json();

  const userResponse = await fetch(
    joinURL(instanceUrl, `/api/i`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ i: token }),
    })

  return new Response(JSON.stringify(await userResponse.json()), {
    status: 200
  })
}
