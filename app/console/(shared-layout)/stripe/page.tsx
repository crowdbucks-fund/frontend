"use client";
import { Button, CircularProgress, VStack } from "@chakra-ui/react";
import { CenterLayout } from "app/console/components/CenterLayout";
import LinkIcon from "assets/icons//link-2.svg?react";
import StripeLogo from "assets/images/Stripe.svg?react";
import { CreateFirstEntity } from "components/FirstEntity";
import { StripeCard } from "components/StripeCard";
import { toast } from "components/Toast";
import { useConnectToStripe } from "hooks/useConnectToStripe";
import { useDesktop } from "hooks/useDesktop";
import { api } from "lib/api";
import { queryClient } from "lib/reactQuery";
import { isStripeConnected } from "lib/stripe";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useAuth } from "states/console/user";

export default function StripePage() {
  const isDesktop = useDesktop();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {
    user,
    loading: isLoadingUser,
    isFetching: isFetchingUser,
  } = useAuth();
  const router = useRouter();
  const isVerifying = useSearchParams().get("verify") !== null;

  const { mutate: verifyConnection, isLoading: isValidatingUser } = useMutation(
    {
      mutationKey: "confirmStripeIntegrationByUser",
      mutationFn: () => {
        return api.confirmStripeIntegrationByUser({});
      },
      onSuccess(data) {
        queryClient.invalidateQueries(["getProfile"]);
        router.replace(window.location.href.replace("?verify", ""));
        if (data.chargesEnabled)
          toast({
            status: "success",
            title: "Successfully connected to stripe",
          });
      },
      onError() {
        router.replace(window.location.href.replace("?verify", ""));
      },
    }
  );

  useEffect(() => {
    if (isVerifying) verifyConnection();
  }, [isVerifying]);

  const { mutate: disconnectAccount, isLoading: isDisconnectingAccount } =
    useMutation(api.disconnectStripeAccountByUser.bind(api), {
      onSuccess() {
        queryClient.invalidateQueries(["getProfile"]);
        toast({
          status: "success",
          title: "Account disconnected successfully",
        });
      },
    });

  const { connectToStripe, loading: isConnectingToStripe } = useConnectToStripe(
    {
      onSuccess(data) {
        setIsRedirecting(true);
        router.push(data.url);
      },
    }
  );

  const loading = isConnectingToStripe || isRedirecting;
  return (
    <CenterLayout
      maxW={{ md: "630px" }}
      h="full"
      flexGrow={{ base: 1, md: "unset" }}
      wrapperProps={{
        pt: 0,
      }}
    >
      {isValidatingUser || isFetchingUser || isLoadingUser || isVerifying ? (
        <CircularProgress isIndeterminate size="40px" color="secondary.500" />
      ) : !isStripeConnected(user!) ? (
        <CreateFirstEntity
          image={StripeLogo}
          icon={
            loading ? (
              <CircularProgress
                isIndeterminate
                size="18px"
                p="3px"
                color={isDesktop ? "primary.500" : "black"}
              />
            ) : !isDesktop ? (
              <LinkIcon />
            ) : undefined
          }
          btnText={
            isDesktop
              ? "Connect your stripe account to collect money"
              : "Connect to stripe to collect money"
          }
          link={"#"}
          disabled={loading}
          onClick={connectToStripe}
          mobileButtonText="Connect to stripe"
          title="Start planting seeds"
        />
      ) : (
        <VStack
          flexGrow={1}
          h="full"
          w="full"
          justify="start"
          gap={{ base: 4, md: 6 }}
        >
          <StripeCard
            name={user?.stripeAccountInfo?.displayName || ""}
            stripeUrl="https://dashboard.stripe.com/"
            partiallyConnect={!user?.stripeAccountInfo?.chargesEnabled}
          />
          <Button
            textUnderlineOffset={"5px"}
            variant="link"
            color="brand.black.4"
            textDecoration="underline"
            fontWeight="medium"
            fontSize={{ base: "12px", md: "20px" }}
            isLoading={isDisconnectingAccount}
            loadingText="Disconnecting account"
            onClick={disconnectAccount}
          >
            Request payment cancelation
          </Button>
        </VStack>
      )}
    </CenterLayout>
  );
}
