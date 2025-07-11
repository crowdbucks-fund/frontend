import { NodeOAuthClient } from '@atproto/oauth-client-node';
import { generateBskyClientMetadata } from 'app/auth/bsky/client-meta.json/route';
import { redirect } from "next/navigation";

class InMemoryStore {
  constructor() {
  }

  async set(key: string) {
  }

  async get(key: string) {
    return null;
  }

  async del(key: string) {
  }
}

export async function GET() {
  const authClient = new NodeOAuthClient({
    clientMetadata: await generateBskyClientMetadata(),
    responseMode: 'query',
    stateStore: new InMemoryStore(),
    sessionStore: new InMemoryStore(),
  })


  redirect(await authClient.authorize('https://bsky.social'))
}
