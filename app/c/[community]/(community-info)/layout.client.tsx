"use client";
import { AuthWizardContent } from "app/auth/components/AuthWizard";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useAuth } from "states/console/user";

const SignInModal: FC<{
  isOpen: boolean;
  onSignin: (token: string) => Promise<void>;
  oauthInstance: string | null;
}> = ({ isOpen, onSignin, oauthInstance }) => {
  return (
    <ResponsiveDialog
      showCloseButton={false}
      isOpen={isOpen}
      onClose={() => {}}
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
}: PropsWithChildren<{
  onAuthorize: (token: string) => Promise<void>;
  oauthInstance: string | null;
}>) {
  const { user, isFetching } = useAuth({
    onError(err) {},
  });
  const [isAuthorized, setIsAuthorized] = useState(true);
  useEffect(() => {
    if (!user && !isFetching) setIsAuthorized(false);
  }, [user, isFetching]);

  const onAuthorized = async (token: string) => {
    setIsAuthorized(true);
    await onAuthorize(token);
  };

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
