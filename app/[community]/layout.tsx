import ConsoleLayout from "app/console/components/ConsoleLayout";
import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import { sortGoals } from "hooks/useGoals.server";
import { api } from "lib/api";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import { CommunityPublicPageLayout } from "./layout.client";

const fetchCommunity = async (handle: string) => {
  try {
    return await api
      .findCommunityByUser({
        handle: decodeURIComponent(handle),
      })
      .then((res) => {
        res.name = res.handleAlias;
        res.handle = res.handleAlias;
        res.goals.sort(sortGoals);
        return res;
      });
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
