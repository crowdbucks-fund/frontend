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
  const community = await fetchCommunity(params.community);
  if (!community) return notFound();
  (params as any).currentCommunity = community;
  return (
    <CommunityPublicPageLayout community={community}>
      {children}
    </CommunityPublicPageLayout>
  );
}
