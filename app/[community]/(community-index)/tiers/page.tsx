import { fetchCommunity } from "app/[community]/layout";
import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import TiersList from "./page.client";

export default async function TierPage({ params }: { params: Params }) {
  const { community: communityHandle } = await params;
  const user = await fetchProfile();
  const community = await fetchCommunity(communityHandle.toString())!;

  return <TiersList user={user.profile} community={community!} />;
}
