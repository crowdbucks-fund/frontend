import { PropsWithChildren } from "react";
import { CommunityPublicPageLayoutWithDetails } from "./layout.client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default ({ children }: PropsWithChildren) => {
  return (
    <CommunityPublicPageLayoutWithDetails>
      {children}
    </CommunityPublicPageLayoutWithDetails>
  );
};
