"use client";
import {
  Button,
  chakra,
  CircularProgress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { CenterLayout } from "app/console/components/CenterLayout";
import LinkIconBase from "assets/icons/link-2.svg?react";
import StripeLogo from "assets/images/Stripe.svg";
import { CreateFirstEntity } from "components/FirstEntity";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { StripeCard } from "components/StripeCard";
import { toast } from "components/Toast";
import { useConnectToStripe } from "hooks/useConnectToStripe";
import { api } from "lib/api";
import { queryClient } from "lib/reactQuery";
import { isStripeConnected } from "lib/stripe";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { useAuth } from "states/console/user";

const LinkIcon = chakra(LinkIconBase);

export default function StripePage() {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {
    user,
    loading: isLoadingUser,
    isFetching: isFetchingUser,
  } = useAuth();
  const router = useRouter();
  const isVerifying = useSearchParams().get("verify") !== null;
  const community = useCurrentCommunity();
  useUpdateBreadcrumb(
    {
      breadcrumb: [
        {
          title: `${community!.name}`,
          link: `/console`,
          startsWith: false,
        },
        {
          title: "Stripe",
          link: `/console/stripe`,
          startsWith: false,
        },
      ],
      title: `${community!.name}`,
    },
    []
  );
  const { mutate: verifyConnection, isPending: isValidatingUser } = useMutation(
    {
      mutationFn: () => {
        return api.confirmStripeIntegrationByUser({});
      },
      onSuccess(data) {
        queryClient.invalidateQueries({ queryKey: ["getProfile"] });
        router.replace(window.location.href.replace("?verify", ""));
        if (data.chargesEnabled)
          toast({
            status: "success",
            title: "Successfully connected to Stripe",
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

  const { mutate: disconnectAccount, isPending: isDisconnectingAccount } =
    useMutation({
      mutationFn: api.disconnectStripeAccountByUser.bind(api),
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["getProfile"] });
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
                __css={{
                  color: {
                    md: "primary.500",
                    base: "black",
                  },
                }}
              />
            ) : (
              <LinkIcon
                display={{
                  base: "none",
                  md: "block",
                }}
              />
            )
          }
          btnText={"Connect to Stripe to collect money"}
          link={"#"}
          disabled={loading}
          onClick={connectToStripe}
          mobileButtonText="Connect to Stripe"
          title=""
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
            onClick={setCancelModalOpen.bind(null, true)}
          >
            Request payment cancelation
          </Button>
        </VStack>
      )}
      <ResponsiveDialog
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Request payment cancelation"
      >
        <VStack
          spacing={4}
          align="start"
          maxW="500px"
          alignItems="center"
          w="full"
        >
          <Text fontWeight="bold" fontSize={{ base: "18px", md: "28px" }}>
            Disconnect Stripe Account?
          </Text>
          <VStack gap={0}>
            <Text fontSize={{ base: "14px", md: "20px" }} textAlign="center">
              Are you sure you want to disconnect your Stripe account?
            </Text>
            <Text fontSize={{ base: "14px", md: "20px" }} textAlign="center">
              You won’t be able to receive donations until you connect it again.
            </Text>
          </VStack>
          <VStack w="full" flexDir={{ base: "column", sm: "row-reverse" }}>
            <Button
              size="lg"
              w="full"
              colorScheme="red"
              onClick={disconnectAccount}
            >
              Confirm Cancelation
            </Button>
            <Button
              variant="outline"
              size="lg"
              w="full"
              onClick={() => setCancelModalOpen(false)}
            >
              Not now
            </Button>
          </VStack>
        </VStack>
      </ResponsiveDialog>
    </CenterLayout>
  );
}
