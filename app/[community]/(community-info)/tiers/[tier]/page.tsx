import { fetchCommunity } from "app/[community]/layout";
import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import { api } from "lib/api";
import { notFound } from "next/navigation";
import TierClientPage from "./page.client";

const findTier = async (communityHandle: string, tierId: number) => {
  try {
    return await api.confirmCommunityTierExists({
      communityHandle,
      tierId,
    });
  } catch (e) {
    return null;
  }
};

export default async function TierPage({ params }: { params: Params }) {
  const { community: communityHandle, tier } = await params;
  const [community, user] = await Promise.all([
    fetchCommunity(communityHandle.toString()),
    fetchProfile(),
  ]);

  const currentTier = await findTier(
    // @ts-ignore
    community._handle,
    parseInt(tier.toString())
  );
  if (currentTier && currentTier.belongsToCommunity)
    return (
      <TierClientPage tier={currentTier} community={community} user={user} />
    );
  return notFound();
}
