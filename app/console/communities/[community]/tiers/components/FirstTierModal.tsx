"use client";
import { Button, Text, VStack, useClipboard } from "@chakra-ui/react";
import ShareIcon from "assets/icons/Share my community.svg?react";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { TierCard } from "components/TierCard";
import { toast } from "components/Toast";
import { useDesktop } from "hooks/useDesktop";
import { FC, useEffect } from "react";
import { LocalUserTier } from "types/Tier";
import { generateCommunityLink } from "utils/community";
import { useCurrentCommunity } from "../../components/community-validator-layout";

export type FirstTierModal = {
  isOpen: boolean;
  onClose: () => void;
  tier: LocalUserTier | null;
};

export const FirstTierModal: FC<FirstTierModal> = ({
  isOpen,
  onClose,
  tier,
}) => {
  const community = useCurrentCommunity();
  const isDesktop = useDesktop();
  const { onCopy, hasCopied } = useClipboard(
    generateCommunityLink(community.handle)
  );
  useEffect(() => {
    if (hasCopied)
      toast({
        status: "success",
        title: `Copied the link to ${community.name} community`,
        description: generateCommunityLink(community.handle, false),
      });
  }, [hasCopied]);
  return (
    <ResponsiveDialog title="" isOpen={isOpen} onClose={onClose}>
      <VStack gap={6} w="full">
        <VStack
          w="full"
          gap={{ base: 0, md: 2 }}
          justify="center"
          textAlign="center"
          pt={{ md: 4 }}
        >
          <Text fontWeight="bold" fontSize={{ base: "18px", md: "28px" }}>
            You have your first tier ready!
          </Text>
          <Text fontSize={{ base: "14px", md: "20px" }} color="#343333">
            you&rsquo;re ready to collect money
          </Text>
        </VStack>
        {tier && (
          <TierCard
            editable={false}
            community={community}
            tier={tier}
            border="2px solid"
            borderColor={"brand.gray.1"}
          />
        )}
        <Button
          onClick={onCopy}
          leftIcon={<ShareIcon />}
          colorScheme="primary"
          variant="solid"
          w="full"
          size="lg"
        >
          Share my community {isDesktop && "to collect money"}
        </Button>
      </VStack>
    </ResponsiveDialog>
  );
};
