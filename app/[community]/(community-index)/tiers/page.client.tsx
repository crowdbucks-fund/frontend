"use client";
import { Button, chakra, HStack, Text, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { UserTier } from "@xeronith/granola/core/objects";
import {
  FindCommunityByUserResult,
  GetProfileResult,
} from "@xeronith/granola/core/spi";
import { EmptyState } from "app/[community]/(community-index)/EmptyState";
import { CenterLayout } from "app/console/components/CenterLayout";
import TickSquare from "assets/icons/tick-square.svg?react";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { TierCard } from "components/TierCard";
import { toast } from "components/Toast";
import { usePaymentVerification } from "hooks/usePaymentVerification";
import { sortTiers } from "hooks/useTiers.server";
import { api } from "lib/api";
import { lowerCase } from "lodash";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";
import { joinURL } from "ufo";
import { getCommunityLink, getCommunityTiersLink } from "utils/community";

const CheckIcon = chakra(TickSquare);

export default function TiersClientPage({
  user,
  community,
}: {
  user: GetProfileResult | null;
  community: FindCommunityByUserResult;
}) {
  const [isUnsubscribeOpen, setIsUnSubscribeOpen] = useState(false);
  const [{ hasPayment, isSuccess }, updatePaymentState] =
    usePaymentVerification();
  const [unSubscribingTier, setUnSubscribingTier] = useState<
    UserTier | undefined
  >(undefined);
  const isSubscribedToTier = useCallback(
    (tierId: number) => {
      if (!user) return false;
      // @ts-ignore
      return user.subscribedTierIds.includes(tierId);
    },
    [user]
  );

  useUpdateBreadcrumb({
    breadcrumb: [
      {
        title: `${community.name}`,
        link: getCommunityLink(community),
        startsWith: true,
      },
    ],
    title: `${community.name}`,
    back: {
      link: "/console",
      title: "Console",
    },
    showConsoleMenu: false,
  });

  const unSubscribeTier = useCallback((tier: UserTier) => {
    setUnSubscribingTier(tier);
    setIsUnSubscribeOpen(true);
  }, []);

  return (
    <CenterLayout maxW={{ md: "630px" }} mx="auto" gap={{ base: 4, md: 8 }}>
      <ResponsiveDialog
        isOpen={isSuccess}
        onClose={updatePaymentState.bind(null, {
          hasPayment: false,
          isSuccess: false,
        })}
        title=""
      >
        <VStack
          justify="center"
          textAlign="center"
          gap={4}
          py={4}
          mt={{
            base: 0,
            md: 6,
          }}
        >
          <CheckIcon color="primary.500" w={{ base: "42px", md: "52px" }} />
          <Text textStyle="modalTitle">Thanks a lot for your contribution</Text>
        </VStack>
      </ResponsiveDialog>
      {community.customAmountsEnabled && (
        <VStack
          role="group"
          gap={{ base: 4, md: 7 }}
          p={{ md: 8, base: 4 }}
          bg="white"
          borderRadius={{ base: "12px", md: "18px" }}
          w="full"
          align="start"
        >
          <HStack justify="space-between" w="full" overflow="hidden">
            <VStack
              align="start"
              overflow="hidden"
              gap={{ base: 4, md: 6 }}
              w="full"
            >
              <Text
                fontSize={{ base: "14px", md: "20px" }}
                fontWeight={{ base: "normal", md: "bold" }}
                isTruncated
                maxW="100%"
              >
                Custom amount
              </Text>
              <Button
                as={NextLink}
                href={joinURL(getCommunityTiersLink(community), "custom")}
                colorScheme="primary"
                variant="solid"
                size="lg"
                w="full"
              >
                Pay now
              </Button>
            </VStack>
          </HStack>
        </VStack>
      )}
      {community.tiers.length === 0 && !community.customAmountsEnabled && (
        <EmptyState>There is no tier defined yet!</EmptyState>
      )}
      {community.tiers.sort(sortTiers).map((tier) => {
        const isSubscribed = isSubscribedToTier(tier.id);
        return (
          <TierCard
            key={tier.id}
            community={community}
            tier={tier}
            btnText={
              isSubscribed
                ? "Unsubscribe"
                : `Join with $${tier.amount} a ${lowerCase(
                    tier.tierFrequency?.unit
                  )}`
            }
            buttonProps={{
              as: isSubscribed ? undefined : NextLink,
              href: isSubscribed
                ? undefined
                : joinURL(getCommunityTiersLink(community), String(tier.id)),
              variant: isSubscribed ? "glass" : "solid",
              colorScheme: tier.recommended ? "secondary" : "primary",
              color: undefined,
              border: isSubscribed ? "1px solid" : undefined,
              onClick: isSubscribed ? () => unSubscribeTier(tier) : undefined,
            }}
          />
        );
      })}
      <UnsubscribeTierModal
        tier={unSubscribingTier}
        isOpen={isUnsubscribeOpen}
        onCancel={() => setIsUnSubscribeOpen(false)}
      />
    </CenterLayout>
  );
}

export const UnsubscribeTierModal: FC<{
  tier?: UserTier;
  isOpen: boolean;
  onCancel: () => void;
}> = ({ tier, onCancel, isOpen }) => {
  const router = useRouter();
  const { mutate: unsubscribe, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      return api.cancelTierSubscriptionByUser({
        tierId: tier?.id || 0,
      });
    },
    onSuccess() {
      toast({
        status: "success",
        title: "You've successfully unsubscribed from the tier",
      });
      onCancel();
    },
    onError() {
      toast({
        status: "error",
        title: "Something went wrong, please try again",
      });
    },
    onSettled() {
      router.refresh();
      // useAuth.fetchProfile();
    },
  });

  return (
    <ResponsiveDialog isOpen={isOpen} onClose={onCancel} title="">
      <VStack justifyContent="center" w="full" gap={6}>
        {tier && (
          <Text fontWeight="bold" fontSize={{ base: "18px", md: "28px" }}>
            Unsubscribe from “{tier.name}”?
          </Text>
        )}
        {tier && (
          <VStack gap="0">
            <Text
              fontSize={{ base: "14px", md: "20px" }}
              maxW={"440px"}
              textAlign={"center"}
            >
              Your {lowerCase(tier.tierFrequency?.name)} support of $
              {tier.amount} helps a lot.
            </Text>
            <Text
              fontSize={{ base: "14px", md: "20px" }}
              maxW={"520px"}
              textAlign={"center"}
            >
              You can unsubscribe for now and rejoin anytime in the future.
            </Text>
          </VStack>
        )}
        <HStack flexDir="row-reverse" w="full">
          <Button
            size="lg"
            w="full"
            colorScheme="primary"
            variant="outline"
            onClick={() => unsubscribe()}
            isLoading={isLoading}
            loadingText="Unsubscribing..."
          >
            Unsubscribe
          </Button>
          <Button size="lg" w="full" colorScheme="primary" onClick={onCancel}>
            Cancel
          </Button>
        </HStack>
      </VStack>
    </ResponsiveDialog>
  );
};
