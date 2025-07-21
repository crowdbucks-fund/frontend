import { setAuthCookie } from "app/auth/page";
import { serializeOauthStateCookie } from "app/auth/utils";
import { PropsWithChildren } from "react";
import CommunityInfoLayoutClient from "./layout.client";

export default async function CommunityInfoLayout({
  children,
}: PropsWithChildren) {
  const { instance } = (await serializeOauthStateCookie().catch((e) => ({
    instance: null,
  }))) as { instance: string | null };

  return (
    <CommunityInfoLayoutClient
      onAuthorize={setAuthCookie}
      oauthInstance={instance}
    >
      {" "}
      {children}
    </CommunityInfoLayoutClient>
  );
}
