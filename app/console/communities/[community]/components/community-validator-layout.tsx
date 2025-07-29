"use client";
import { useQuery } from "@tanstack/react-query";
import { GetCommunityByUserResult } from "@xeronith/granola/core/spi";
import { FullPageLoading } from "components/Loading";
import { useCommunities } from "hooks/useCommunities";
import { api } from "lib/api";
import { store } from "lib/jotai";
import { useParams } from "next/navigation";
import { createContext, PropsWithChildren, useContext } from "react";
import { userProfileSSR } from "states/console/user";
import { CommunityNotFound } from "./not-found";

export const CurrentCommunityContext = createContext<
  (GetCommunityByUserResult & { isLoading: boolean }) | null
>(null);

export default function CommunityValidatorLayout({
  children,
}: PropsWithChildren) {
  const communityId = useParams<{ community: string }>().community.toString();
  const {
    data: communities,
    isLoading: communitiesLoading,
    isFetching: communitiesFetching,
  } = useCommunities({
    enabled: communityId === "default",
  });

  const {
    data: community,
    isLoading: communityLoading,
    isFetching: isFetchingCommunity,
    isError,
  } = useQuery({
    queryKey: ["COMMUNITY", communityId],
    staleTime: 1000,
    queryFn: () => {
      if (communityId === "default" && communities) {
        const user = store.get(userProfileSSR);
        if (user) {
          // @ts-expect-error invalid property
          if (!communities[0]._handle) {
            // @ts-expect-error invalid property
            communities[0]._handle = communities[0].handle;
          }
          communities[0].handle = user.mastodonUsername.replace("@", "");
          communities[0].name = user.mastodonUsername.replace("@", "");
        }
        return communities[0];
      }
      return api.getCommunityByUser({
        id: parseInt(communityId),
      });
    },
    enabled:
      communityId !== "default" || (communityId === "default" && !!communities),
  });

  const isFetching = communitiesFetching || isFetchingCommunity;
  const isLoading = communitiesLoading || communityLoading;

  if (isLoading) return <FullPageLoading />;
  if (isError) return <CommunityNotFound />;
  if (community)
    return (
      <CurrentCommunityContext.Provider
        value={{ ...(community || {}), isLoading: isLoading || isFetching }}
      >
        {children}
      </CurrentCommunityContext.Provider>
    );
}
export const useCurrentCommunity = <
  T = GetCommunityByUserResult & { isLoading: boolean },
>() => useContext(CurrentCommunityContext)! as T;
