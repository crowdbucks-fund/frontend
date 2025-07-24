"use client";
import { FindCommunityByUserResult } from "@xeronith/granola/core/spi";
import { CurrentCommunityContext } from "app/console/communities/[community]/components/community-validator-layout";
import { FC, PropsWithChildren } from "react";

export const CommunityPublicPageLayout: FC<
  PropsWithChildren<{ community: FindCommunityByUserResult }>
> = ({ community, children }) => {
  return (
    <CurrentCommunityContext.Provider
      value={{ ...(community || {}), isLoading: false }}
    >
      {children}
    </CurrentCommunityContext.Provider>
  );
};
