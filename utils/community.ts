'use client'
import { toast } from "components/Toast";
import { platformInfo } from "platform";
import { Community } from "types/Community";
import { joinURL, withoutProtocol } from "ufo";

export const generateCommunityLink = (communityUsername: string, withProtocol: boolean = true) => {
  const baseUrl = !withProtocol ? withoutProtocol(platformInfo.url) : platformInfo.url;
  return joinURL(baseUrl, platformInfo.communityPrefix, communityUsername);
}

export const linkCoppiedCallback = (community: Community) => {
  toast({
    status: "success",
    title: `Community link copied`,
    description: generateCommunityLink(community.handle, false),
  });
};
export const getCommunityLink = (community: Community, withHost: boolean = false) => {
  return joinURL(withHost ? platformInfo.url : '', platformInfo.communityPrefix, community.handle)
}
export const getCommunityTiersLink = (community: Community, withHost: boolean = false) => {
  return joinURL(withHost ? platformInfo.url : '', platformInfo.communityPrefix, community.handle, 'tiers')
}
export const getCommunityGoalsLink = (community: Community, withHost: boolean = false) => {
  return joinURL(withHost ? platformInfo.url : '', platformInfo.communityPrefix, community.handle, 'goals')
}
