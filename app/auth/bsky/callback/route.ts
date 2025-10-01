import { Agent } from '@atproto/api';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createBskyOauthClient, InMemoryStore } from "app/auth/bsky/client";
import { captureException } from "app/posthog-server";
import invariant from "lib/invariant";
import { NextResponse } from "next/server";
import { parseURL } from "ufo";

export async function POST(req: Request) {
  const sessionStore = new InMemoryStore();
  try {
    const params = new URLSearchParams(await req.json());

    const client = await createBskyOauthClient(undefined, sessionStore);
    const { session } = await client.callback(params)

    const agent = new Agent(session);

    const sessionData = (await sessionStore.get(session.did));
    const remoteSession = await agent.com.atproto.server.getSession()

    invariant(sessionData, 'Authentication failed, please try again later.', { session });

    const instance = sessionData?.tokenSet?.iss
    if (sessionData) {
      delete sessionData.tokenSet?.refresh_token
      delete sessionData.tokenSet?.scope
    }

    sessionData['headers'] = {
      'dpop-nonce': remoteSession.headers['dpop-nonce']
    }

    const token = JSON.stringify(sessionData)

    invariant(token, 'Authentication failed, please try again later.', { instance, token });
    return NextResponse.json({
      token,
      instance: parseURL(instance).host,
      email: remoteSession.data.email,
      username: remoteSession.data.handle
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
