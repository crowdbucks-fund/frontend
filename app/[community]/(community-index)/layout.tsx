import { PropsWithChildren } from "react";
import { CommunityPublicPageLayoutWithDetails } from "./layout.client";

export default ({ children }: PropsWithChildren) => {
  return (
    <CommunityPublicPageLayoutWithDetails>
      {children}
    </CommunityPublicPageLayoutWithDetails>
  );
};
