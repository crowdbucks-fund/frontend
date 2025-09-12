"use client";
import { GetProfileResult } from "@xeronith/granola/core/spi";
import { AuthWizardContent } from "app/auth/components/AuthWizard";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { getCommunityLink } from "utils/community";

const SignInModal: FC<{
  isOpen: boolean;
  onSignin: (token: string) => Promise<void>;
  oauthInstance: string | null;
}> = ({ isOpen, onSignin, oauthInstance }) => {
  const community = useCurrentCommunity();
  const router = useRouter();

  return (
    <ResponsiveDialog
      showCloseButton={true}
      isOpen={isOpen}
      onClose={() => {
        router.replace(getCommunityLink(community));
      }}
      title=""
      showTitleOnMobile={false}
    >
      <AuthWizardContent
        content={{
          email: {
            title: "Let us know your email",
            // description: 'Let us know your email',
          },
          default: {
            title: "Please sign in to continue",
          },
        }}
        compact
        onSignIn={onSignin}
        changeRouteOnCompleteSteps={false}
        oAuthInstance={oauthInstance}
      />
    </ResponsiveDialog>
  );
};

export default function CommunityInfoLayoutClient({
  children,
  onAuthorize,
  oauthInstance,
  user,
}: PropsWithChildren<{
  onAuthorize: (token: string) => Promise<void>;
  oauthInstance: string | null;
  user: GetProfileResult | null;
}>) {
  const [isAuthorized, setIsAuthorized] = useState(() => !!user);

  const onAuthorized = async (token: string) => {
    await onAuthorize(token);
  };

  useEffect(() => {
    setIsAuthorized(!!user);
  }, [user]);

  return (
    <>
      {children}
      <SignInModal
        isOpen={!isAuthorized}
        onSignin={onAuthorized}
        oauthInstance={oauthInstance}
      />
    </>
  );
}
