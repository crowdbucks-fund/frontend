import { generateBskyClientMetadata } from "app/auth/bsky/client";

export async function GET() {
  return new Response(
    JSON.stringify(await generateBskyClientMetadata()),
    {
      headers: {
        "Content-Type": "application/json",
      }
    })
}
