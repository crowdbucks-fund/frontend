import { getCloudflareContext } from "@opennextjs/cloudflare";
import { decryptCookie } from "lib/cookies";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { cookies } from "next/headers";
import invariant from "tiny-invariant";
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
  invariant(!!oauthStateCookie, "Invalid state");
  return await decryptCookie(oauthStateCookie)
}

export const deleteOauthStateCookie = async () => {
  const cookie = await cookies()
  await cookie.delete("oauth_state");
}

export const getInstanceCredentials = async (instance: string) => {
  const kv = getCloudflareContext().env.OAUTH_KV;
  const credentials = await kv.get<{ client_id: string, client_secret: string }>(`instance_${instance}`.toLowerCase(), "json");
  return credentials;
}

export const storeInstanceCredentials = async (instance: string, credentials: { client_id: string, client_secret: string }) => {
  const kv = getCloudflareContext().env.OAUTH_KV;
  await kv.put(`instance_${instance}`, JSON.stringify(credentials));
}
