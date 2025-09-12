import { fetchCommunity } from "app/[community]/layout";
import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import CustomTierClientPage from "./page.client";

export default async function CustomTierPage({ params }: { params: Params }) {
  const { community: communityHandle } = await params;
  const [community, auth] = await Promise.all([
    fetchCommunity(communityHandle.toString())!,
    fetchProfile(),
  ]);
  return <CustomTierClientPage community={community!} auth={auth} />;
}
