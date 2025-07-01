import { toast } from "components/Toast";
import { platformInfo } from "platform";
import { Community } from "types/Community";
import { joinURL } from "ufo";

export const generateCommunityLink = (communityUsername: string, withHttps: boolean = true) => `${withHttps ? `${window.location.protocol}//` : ''}${window.location.host}/c/${communityUsername}`

export const linkCoppiedCallback = (community: Community) => {
  toast({
    status: "success",
    title: `Community link copied`,
    description: generateCommunityLink(community.handle, false),
  });
};
export const getCommunityLink = (community: Community) => {
  return joinURL(platformInfo.communityPrefix, community.handle)
}
export const getCommunityTiersLink = (community: Community) => {
  return joinURL(platformInfo.communityPrefix, community.handle, 'tiers')
}
export const getCommunityGoalsLink = (community: Community) => {
  return joinURL(platformInfo.communityPrefix, community.handle, 'goals')
}
