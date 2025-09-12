import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyCookie } from "lib/cookies";
import invariant from "lib/invariant";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { cookies } from "next/headers";
import { hash } from 'ohash';
import { stringifyParsedURL, withQuery } from "ufo";

export const getRedirectUrl = (headers: ReadonlyHeaders, oauthCallbackPath: string, step?: string) => {
  const host = headers.get("host")!
  return withQuery(stringifyParsedURL({
    host,
    pathname: oauthCallbackPath,
    protocol: (headers.get("x-forwarded-proto") || "https") + ":",
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
