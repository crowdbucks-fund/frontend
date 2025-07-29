import { fetchCommunity } from "app/[community]/layout";
import CustomTierClientPage from "./page.client";

export default async function CustomTierPage({ params }: { params: Params }) {
  const { community: communityHandle } = await params;
  const community = await fetchCommunity(communityHandle.toString())!;
  return <CustomTierClientPage community={community} />;
}
