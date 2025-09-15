import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createBskyOauthClient, InMemoryStore } from "app/auth/bsky/client";
import { captureException } from "app/posthog-server";
import invariant from "lib/invariant";
import { NextResponse } from "next/server";
import { parseURL } from "ufo";

export async function POST(req: Request) {
  const sessionStore = new InMemoryStore();
  try {
    const client = await createBskyOauthClient(undefined, sessionStore);
    const params = new URLSearchParams(await req.json());
    const { session } = await client.callback(params)
    const sessionData = (await sessionStore.get(session.did));
    invariant(sessionData, 'Authentication failed, please try again later.', { session });
    const instance = sessionData?.tokenSet?.iss
    const token = sessionData?.tokenSet?.access_token
    invariant(sessionData, 'Authentication failed, please try again later.', { instance, token });
    return NextResponse.json({
      token,
      instance: parseURL(instance).host,
    })
  } catch (error: any) {
    getCloudflareContext().ctx.waitUntil(captureException(error, req))

    error.message = error.message && error.message.startsWith('Invariant failed:') ?
      error.message.replace('Invariant failed: ', '').trim()
      : 'Something went wrong, please try again later.';

    return NextResponse.json({ error: error.message }, {
      status: 400
    });
  }
}
