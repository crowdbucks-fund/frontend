import { Button, Text, VStack } from "@chakra-ui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useCaptureException } from "hooks/useCaptureException";
import NextLink from "next/link";
import { useCurrentCommunity } from "../../components/community-validator-layout";

export const TierNotFound = () => {
  const community = useCurrentCommunity();
  useCaptureException(new Error("Tier not found"));
  return (
    <VStack justify="center" flexGrow={1}>
      <Text color="red.500">
        <ExclamationTriangleIcon width="48px" height="48px" />
      </Text>
      <Text fontWeight="bold" fontSize="28px">
        Tier not found!
      </Text>
      <Button
        href={`/console/communities/${community.id}/tiers`}
        as={NextLink}
        variant="outline"
        colorScheme="primary"
        size="lg"
      >
        Back to community
      </Button>
    </VStack>
  );
};
