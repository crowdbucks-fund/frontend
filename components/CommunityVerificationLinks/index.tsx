import { FC } from "react";

export const CommunityMetaTags: FC<{ communityHandle: string }> = ({
  communityHandle,
}) => {
  const communityParts = communityHandle.split("@");
  if (communityParts.length <= 1) return null;
  return (
    <>
      <link
        rel="me"
        href={`https://${communityParts[1]}/@${communityParts[0]}`}
      />
      <meta name="fediverse:creator" content={"@" + communityHandle}></meta>
    </>
  );
};
