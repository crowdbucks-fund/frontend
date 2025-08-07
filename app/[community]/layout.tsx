import ConsoleLayout from "app/console/components/ConsoleLayout";
import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import { sortGoals } from "hooks/useGoals.server";
import { api } from "lib/api";
import { notFound, redirect } from "next/navigation";
import { cache, PropsWithChildren } from "react";
import { CommunityPublicPageLayout } from "./layout.client";

export const fetchCommunity = cache(async (handle: string) => {
  handle = decodeURIComponent(handle);
  if (handle.startsWith("@")) handle = handle.slice(1);
  return api
    .findCommunityByUser({
      handleOrAlias: handle,
    })
    .then((res) => {
      res.name = "@" + res.handleAlias;
      // @ts-expect-error this _handle is not in the type
      if (!res._handle) res._handle = res.handle;
      res.handle = res.handleAlias;
      res.goals.sort(sortGoals);
      return res;
    })
    .catch(() => null);
});

export default async function CommunityLayout({
  params,
  children,
}: PropsWithChildren<{ params: { community: string } }>) {
  params = await params;

  const getProfilePromise = fetchProfile();
  const community = await fetchCommunity(params.community);
  if (!community) return notFound();
  (params as any).currentCommunity = community;

  const handle = decodeURIComponent(params.community);
  if (community && !handle.startsWith("@")) {
    return redirect(`/@${community.handle}`);
  }

  return (
    <ConsoleLayout
      publicPage
      getProfilePromise={getProfilePromise}
      authRequired={false}
    >
      <CommunityPublicPageLayout community={community}>
        {children}
      </CommunityPublicPageLayout>
    </ConsoleLayout>
  );
}
