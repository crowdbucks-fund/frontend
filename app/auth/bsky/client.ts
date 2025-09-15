import { NodeOAuthClient, OAuthClientMetadataInput } from "@atproto/oauth-client-node";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getRedirectUrl } from "app/auth/utils";
import { platformInfo } from "platform";
import { joinURL } from "ufo";

export const generateBskyClientMetadata = async (): Promise<Readonly<OAuthClientMetadataInput>> => {
  const isDev = process.env.NODE_ENV !== 'production';
  const redirectUri = getRedirectUrl('bsky');
  const scope = 'atproto'
  const clientUri = process.env.NEXT_PUBLIC_APP_URL

  return {
    client_uri: clientUri,
    client_id: isDev ? `http://localhost?redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}` : joinURL(clientUri, '/auth/bsky/client-meta.json'),
    redirect_uris: [
      redirectUri
    ],
    application_type: "web",
    token_endpoint_auth_method: "none",
    client_name: platformInfo.name,
    dpop_bound_access_tokens: true,
    grant_types: ["authorization_code"],
    scope,
    response_types: ["code"],
    logo_uri: 'https://crowdbucks.fund/logo.png',
  }
}


export class InMemoryStore {
  keyPrefix = 'bsky_oauth_';
  store = new Map<string, any>();
  async set(key: string, value: any) {
    this.store.set(`${this.keyPrefix}${key}`, JSON.stringify(value));
  }

  async get(key: string) {
    const value = this.store.get(`${this.keyPrefix}${key}`);
    return value ? JSON.parse(value) : undefined;
  }

  async del(key: string) {
    this.store.delete(`${this.keyPrefix}${key}`);
  }
}
export class PersistantStore {
  constructor(private keyPrefix = 'bsky_oauth_', private ttl: number = 60 * 60 * 24 * 2 /* 2 days */) {

  }
  async set(key: string, value: any) {
    await getCloudflareContext().env.OAUTH_KV.put(`${this.keyPrefix}${key}`, JSON.stringify(value), {
      expirationTtl: this.ttl,
    });
  }

  async get(key: string) {
    const value = await getCloudflareContext().env.OAUTH_KV.get(`${this.keyPrefix}${key}`);
    return value ? JSON.parse(value) : undefined;
  }

  async del(key: string) {
    return getCloudflareContext().env.OAUTH_KV.delete(`${this.keyPrefix}${key}`);
  }
}

export const createBskyOauthClient = async (stateStore: PersistantStore = new PersistantStore(), sessionStore: InMemoryStore = new InMemoryStore()) => {
  const clientMetadata = await generateBskyClientMetadata();
  return new NodeOAuthClient({
    clientMetadata,
    responseMode: 'query',
    stateStore,
    sessionStore,
    fetch: (input, init) => fetch(input, {
      ...(init || {}),
      cf: {
        cacheEverything: true
      }
    }),
    didResolver: {
      async resolve(did, options) {
        const url = new URL(`/${did}`, 'https://plc.directory/');

        const res = await globalThis.fetch(url, {
          headers: { accept: 'application/did+ld+json,application/json' },
          signal: options?.signal,
          cf: {
            cacheEverything: true,
          },
        })

        if (!res.ok) {
          throw Object.assign(new Error(res.statusText), { status: res.status })
        }
        return await res.json()
      },
    },
  })
}

