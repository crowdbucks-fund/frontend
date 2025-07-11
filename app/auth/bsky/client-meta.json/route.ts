import { OAuthClientMetadataInput } from "@atproto/oauth-client-node"
import { getRedirectUrl } from "app/auth/mastodon/utils"
import { headers } from "next/headers"
import { platformInfo } from "platform"

export const generateBskyClientMetadata = async (): Promise<Readonly<OAuthClientMetadataInput>> => {
  return {
    client_id: process.env.NODE_ENV === 'development' ? 'http://localhost' : process.env.BSKY_OAUTH_CLIENT_ID,
    client_uri: process.env.NODE_ENV === 'development' ? 'http://localhost' : process.env.BSKY_OAUTH_CLIENT_URI,
    redirect_uris: [
      process.env.NODE_ENV === 'development' ? 'http://127.0.0.1/' : getRedirectUrl(await headers(), process.env.OAUTH_REDIRECT!, 'bsky')
    ],
    application_type: "web",
    token_endpoint_auth_method: "none",
    client_name: platformInfo.name,
    dpop_bound_access_tokens: true,
    grant_types: ["authorization_code"],
    scope: "atproto",
    response_types: ["code"],
    logo_uri: 'https://crowdbucks.fund/logo.png',
  }
}

export async function GET() {
  return new Response(
    JSON.stringify(await generateBskyClientMetadata()),
    {
      headers: {
        "Content-Type": "application/json",
      }
    })
}
