"use client";
import { AuthWizardContent } from "app/auth/components/AuthWizard";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { useSetAtom } from "jotai";
import { queryClient } from "lib/reactQuery";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { authTokenAtom, useAuth } from "states/console/user";

const SignInModal: FC<{
  isOpen: boolean;
  onSignin: (token: string) => Promise<void>;
}> = ({ isOpen, onSignin }) => {
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
        }}
        onSignIn={onSignin}
        changeRouteOnCompleteSteps={false}
        oAuthInstance={null}
      />
    </ResponsiveDialog>
  );
};

export default function CommunityInfoLayoutClient({
  children,
  onAuthorize,
}: PropsWithChildren<{ onAuthorize: (token: string) => Promise<void> }>) {
  const { user, isFetching } = useAuth({
    onError(err) {},
  });

  const [isAuthorized, setIsAuthorized] = useState(true);
  const setAuthToken = useSetAtom(authTokenAtom);
  useEffect(() => {
    if (!user && !isFetching) setIsAuthorized(false);
  }, [user, isFetching]);

  const onAuthorized = async (token: string) => {
    setAuthToken(token);
    setIsAuthorized(true);
    await onAuthorize(token);
    queryClient.invalidateQueries();
  };

  return (
    <>
      {children}
      <SignInModal isOpen={!isAuthorized} onSignin={onAuthorized} />
    </>
  );
}
