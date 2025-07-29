import { fetchCommunity } from "app/[community]/layout";
import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import GoalsClientPage from "./page.client";

export default async function GoalsPage({ params }: { params: Params }) {
  const { community: communityHandle } = await params;
  const user = await fetchProfile();
  const community = await fetchCommunity(communityHandle.toString())!;

  return <GoalsClientPage user={user.profile} community={community} />;
}
