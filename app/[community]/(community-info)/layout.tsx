import { setAuthCookie } from "app/auth/page";
import { serializeOauthStateCookie } from "app/auth/utils";
import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import { PropsWithChildren } from "react";
import CommunityInfoLayoutClient from "./layout.client";

export default async function CommunityInfoLayout({
  children,
}: PropsWithChildren) {
  const { instance, platform } = ((await serializeOauthStateCookie().catch(
    () => ({
      instance: null,
    })
  )) as { instance: string | null; platform: string | null }) || {
    instance: null,
    platform: null,
  };
  const user = await fetchProfile();

  return (
    <CommunityInfoLayoutClient
      onAuthorize={setAuthCookie}
      oauthInstance={instance}
      oauthPlatform={platform}
      user={user.profile}
    >
      {children}
    </CommunityInfoLayoutClient>
  );
}
