import ConsoleLayout from "app/console/components/ConsoleLayout";
import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import { api } from "lib/api";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import { CommunityPublicPageLayout } from "./layout.client";

export const dynamic = "force-dynamic";

const fetchCommunity = async (handle: string) => {
  try {
    return await api.findCommunityByUser({
      handle,
    });
  } catch (e) {
    return null;
  }
};

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
    <ConsoleLayout publicPage getProfilePromise={getProfilePromise}>
      <CommunityPublicPageLayout community={community}>
        {children}
      </CommunityPublicPageLayout>
    </ConsoleLayout>
  );
}
