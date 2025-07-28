import ConsoleLayout from "app/console/components/ConsoleLayout";
import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import { sortGoals } from "hooks/useGoals.server";
import { api } from "lib/api";
import { notFound } from "next/navigation";
import { cache, PropsWithChildren } from "react";
import { CommunityPublicPageLayout } from "./layout.client";

const communityCache = cache(() => new Map());
export const fetchCommunity = async (handle: string) => {
  try {
    const cache = communityCache();
    if (!cache.get(handle))
      cache.set(
        handle,
        api
          .findCommunityByUser({
            handle: decodeURIComponent(handle),
          })
          .then((res) => {
            res.name = res.handleAlias;
            // @ts-expect-error this _handle is not in the type
            if (!res._handle) res._handle = res.handle;
            res.handle = res.handleAlias;
            res.goals.sort(sortGoals);
            return res;
          })
      );
    return await cache.get(handle);
  } catch (e) {
    return null;
  }
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CommunityLayout({
  params,
  children,
}: PropsWithChildren<{ params: { community: string } }>) {
  params = await params;

  const getProfilePromise = fetchProfile();
  const community = await fetchCommunity(params.community);
  if (!community) return notFound();
  (params as any).currentCommunity = community;

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
