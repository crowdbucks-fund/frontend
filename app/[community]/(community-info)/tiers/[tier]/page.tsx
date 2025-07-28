import { fetchCommunity } from "app/[community]/layout";
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
  const { community, tier } = await params;
  const com = await fetchCommunity(community.toString());
  const currentTier = await findTier(com._handle, parseInt(tier.toString()));
  if (currentTier && currentTier.belongsToCommunity)
    return <TierClientPage tier={currentTier} />;
  return notFound();
}
