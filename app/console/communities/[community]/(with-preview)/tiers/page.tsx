"use client";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { UserTier } from "@xeronith/granola/core/objects";
import TierIcon from "assets/icons/dollar-square.svg?react";
import { CreateFirstEntity } from "components/FirstEntity";
import { FullPageLoading } from "components/Loading";
import { CreateTierCard, TierCard } from "components/TierCard";
import { useTiers } from "hooks/useTiers";
import { api } from "lib/api";
import { debounce } from "lodash";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useCurrentCommunity } from "../../components/community-validator-layout";
import { DeleteTierModal } from "../../tiers/components/DeleteTierModal";

export default function TiersPage() {
  const params = useParams();
  const [deletingTier, setIsDeletingTier] = useState<UserTier | null>(null);
  const community = useCurrentCommunity();
  const queryClient = useQueryClient();
  const { data: tiers, isLoading } = useTiers({
    communityId: community.id,
  });

  const { mutate: enableCustomAmount, isLoading: enableCustomAmountLoading } =
    useMutation(
      (enabled: boolean) =>
        api.addOrUpdateCommunityByUser({
          ...community,
          customAmountsEnabled: enabled,
        }),
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["COMMUNITY"] });
        },
      }
    );

  const onCustomAmountChanged = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      console.log(!e.target.checked, e.target.value);
      enableCustomAmount(!e.target.checked);
    }, 300),
    []
  );

  if (isLoading) return <FullPageLoading />;
  if (tiers && !tiers.length && !community.customAmountsEnabled)
    return (
      <Box position="relative">
        <Checkbox
          isChecked={community.customAmountsEnabled}
          isDisabled={enableCustomAmountLoading || community.isLoading}
          onChange={onCustomAmountChanged}
          display={{ base: "none", md: "flex" }}
          size="lg"
          position="absolute"
          top={-20}
          right={-6}
          pr="0"
          zIndex={2}
        >
          <Text as="span" mr="2">
            {community.customAmountsEnabled ? "Disable" : "Enable"} custom
            amount
          </Text>
        </Checkbox>
        <CreateFirstEntity
          customAction={
            <Checkbox
              isIndeterminate={enableCustomAmountLoading || community.isLoading}
              icon={
                enableCustomAmountLoading || community.isLoading ? (
                  <CircularProgress size="12px" />
                ) : undefined
              }
              isChecked={community.customAmountsEnabled}
              isDisabled={enableCustomAmountLoading || community.isLoading}
              onChange={onCustomAmountChanged}
              display={{ base: "flex", md: "none" }}
              flexGrow={1}
              w="full"
              zIndex={2}
            >
              {community.customAmountsEnabled ? "Disable" : "Enable"} custom
              amount
            </Checkbox>
          }
          mobileButtonText={
            <HStack>
              <TierIcon />
              <span>Create a tier</span>
            </HStack>
          }
          icon={<></>}
          title="Start growing tiers"
          btnText="Create your first tier"
          link={`/console/communities/${params.community}/tiers/create`}
        />
      </Box>
    );
  if (tiers)
    return (
      <Box position="relative">
        <Checkbox
          isIndeterminate={enableCustomAmountLoading || community.isLoading}
          icon={
            enableCustomAmountLoading || community.isLoading ? (
              <CircularProgress size="15px" />
            ) : undefined
          }
          isChecked={community.customAmountsEnabled}
          isDisabled={enableCustomAmountLoading || community.isLoading}
          onChange={onCustomAmountChanged}
          display={{ base: "none", md: "flex" }}
          size="lg"
          position="absolute"
          top={-20}
          right={-6}
          pr="0"
          zIndex={2}
        >
          {community.customAmountsEnabled ? "Disable" : "Enable"} custom amount
        </Checkbox>
        <HStack py="4" w="full" display={{ base: "flex", md: "none" }}>
          <Checkbox
            isIndeterminate={enableCustomAmountLoading || community.isLoading}
            icon={
              enableCustomAmountLoading || community.isLoading ? (
                <CircularProgress size="12px" />
              ) : undefined
            }
            isChecked={community.customAmountsEnabled}
            isDisabled={enableCustomAmountLoading || community.isLoading}
            onChange={onCustomAmountChanged}
            flexGrow={1}
            w="full"
            zIndex={2}
          >
            {community.customAmountsEnabled ? "Disable" : "Enable"} custom
            amount
          </Checkbox>
          <Button
            as={NextLink}
            href={`/console/communities/${params.community}/tiers/create`}
            px="10"
            variant="outline"
            colorScheme="primary-glass"
            color="primary.500"
            _hover={{ bg: "primary-glass.500" }}
            _active={{ bg: "primary-glass.500" }}
            borderWidth="1px"
            borderColor="primary.500"
            size="lg"
            bg="primary-glass.500"
          >
            Add a tier
          </Button>
        </HStack>
        <VStack maxW={{ md: "630px" }} mx="auto" gap="8">
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
                  gap={{ base: 0, md: 2 }}
                  w="full"
                >
                  <Text
                    fontSize={{ base: "14px", md: "20px" }}
                    fontWeight="bold"
                    isTruncated
                    maxW="100%"
                  >
                    Custom amount
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          )}
          {tiers.map((tier) => {
            return (
              <TierCard
                key={tier.id}
                tier={tier}
                community={community}
                // href={`/console/communities/${community.id}/tiers/${tier.id}`}
                onDelete={setIsDeletingTier.bind(null, tier)}
              />
            );
          })}
          <CreateTierCard />
          <DeleteTierModal
            isOpen={!!deletingTier}
            deletingTier={deletingTier}
            onClose={setIsDeletingTier.bind(null, null)}
          />
        </VStack>
      </Box>
    );
}
