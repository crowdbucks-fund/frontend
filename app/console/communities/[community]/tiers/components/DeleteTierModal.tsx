"use client";
import { Button, Text, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { UserTier } from "@xeronith/granola/core/objects";
import WarningIcon from "assets/icons/warning.svg?react";
import { ResponsiveDialog } from "components/ResponsiveDialog";
import { TierCard } from "components/TierCard";
import { toast } from "components/Toast";
import { api } from "lib/api";
import { queryClient } from "lib/reactQuery";
import { FC } from "react";
import { useCurrentCommunity } from "../../components/community-validator-layout";

export type DeletePaymentCardProps = {
  isOpen: boolean;
  onClose: () => void;
  deletingTier: UserTier | null;
  onDeleted?: () => void;
};

export const DeleteTierModal: FC<DeletePaymentCardProps> = ({
  isOpen,
  onClose,
  deletingTier,
  onDeleted,
}) => {
  const community = useCurrentCommunity();
  const { mutate: deleteBankInfo, isPending: isLoading } = useMutation({
    mutationFn: async () =>
      deletingTier ? api.removeTierByUser({ id: deletingTier.id }) : null,
    onSuccess() {
      toast.closeAll();
      toast({
        status: "success",
        title: deletingTier && `The tier was successfully deleted`,
      });
      queryClient.invalidateQueries({ queryKey: ["findTiersByUser"] });
      onDeleted && onDeleted();
      onClose();
    },
  });
  return (
    <ResponsiveDialog isOpen={isOpen} onClose={onClose} title="Delete Tier">
      <VStack gap={6} w="full">
        <VStack
          w="full"
          justify="center"
          textAlign="center"
          gap={{ base: 1, md: 2 }}
        >
          <WarningIcon />
          <Text fontWeight="bold" fontSize={{ base: "18px", md: "24px" }}>
            This tier is about to be deleted
          </Text>
          <Text fontSize={{ base: "14px", md: "20px" }} color="#343333">
            All the payments will be cancelled
          </Text>
        </VStack>
        {deletingTier && (
          <TierCard
            editable={false}
            community={community}
            tier={deletingTier}
            border="2px solid"
            borderColor={"brand.gray.1"}
          />
        )}
        <Button
          onClick={() => deleteBankInfo()}
          isLoading={isLoading}
          colorScheme="brand.red"
          variant="outline"
          w="full"
          size="lg"
        >
          Delete anyways
        </Button>
      </VStack>
    </ResponsiveDialog>
  );
};
