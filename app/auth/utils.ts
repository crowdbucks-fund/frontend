import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyCookie } from "lib/cookies";
import invariant from "lib/invariant";
import { cookies } from "next/headers";
import { hash } from 'ohash';
import { parseURL, stringifyParsedURL, withQuery } from "ufo";

export const getRedirectUrl = (step?: string, oauthCallbackPath: string = "/auth") => {
  const appURL = parseURL(process.env.NEXT_PUBLIC_APP_URL);
  const host = appURL.host
  return withQuery(stringifyParsedURL({
    host,
    pathname: oauthCallbackPath,
    protocol: (appURL.protocol || "https:"),
  }), {
    step,
  })
};

export const serializeOauthStateCookie = async () => {
  const cookie = await cookies()
  const oauthStateCookie = cookie.get("oauth_state")?.value;
  invariant(!!oauthStateCookie, "Invalid state", {
    cause: "OAuth state cookie is missing or invalid."
  });
  return await verifyCookie(oauthStateCookie)
}

export const deleteOauthStateCookie = async () => {
  const cookie = await cookies()
  await cookie.delete("oauth_state");
}

export const getInstanceCredentials = async (instance: string, callbackUrl: string) => {
  const kv = getCloudflareContext().env.OAUTH_KV;
  const key = hash({
    instance,
    callbackUrl
  })
  const credentials = await kv.get<{ client_id: string, client_secret: string }>(key, "json");
  return credentials;
}

export const storeInstanceCredentials = async (instance: string, callbackUrl: string, credentials: { client_id: string, client_secret: string }) => {
  const kv = getCloudflareContext().env.OAUTH_KV;
  const key = hash({
    instance,
    callbackUrl
  })
  await kv.put(key, JSON.stringify(credentials));
}
