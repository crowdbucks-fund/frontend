import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { EmptyState } from "app/[community]/(community-index)/EmptyState";
import { CenterLayout } from "app/console/components/CenterLayout";
import createCommunityImage from "assets/images/amico.svg";
import Image from "next/image";
import Link from "next/link";
import { FC, ReactNode } from "react";

export type FirstEntityProps = {
  title: string;
  btnText: string;
  noEntityTitle?: string;
  link: string;
  mobileButtonText: ReactNode;
  customAction?: ReactNode;
  image?: any;
  icon?: any;
  onClick?: any;
  disabled?: boolean;
};
export const CreateFirstEntity: FC<FirstEntityProps> = ({
  title,
  btnText,
  link,
  mobileButtonText,
  customAction,
  noEntityTitle,
  image,
  icon,
  onClick,
  disabled = false,
}) => {
  return (
    <CenterLayout flexGrow={{ base: 1, md: "unset" }} maxW="full">
      <HStack gap={4} justify="space-between" w="full" h="full">
        {customAction}
        <Button
          variant="outline"
          color="brand.black.1"
          borderColor="brand.black.1"
          w="full"
          borderWidth="1px"
          justifyContent="space-between"
          rounded="12px"
          rightIcon={icon ? icon : <PlusIcon width="20px" />}
          display={{ base: "flex", md: "none" }}
          as={!onClick ? Link : undefined}
          href={!onClick ? link : undefined}
          onClick={onClick}
          fontSize="sm"
          isDisabled={disabled}
        >
          {mobileButtonText}
        </Button>
      </HStack>
      <VStack
        gap={4}
        flexGrow={{ base: 1, md: "unset" }}
        justifyContent={{ base: "center", md: "unset" }}
      >
        {!!!noEntityTitle && (
          <Image
            alt="create community image"
            src={image || createCommunityImage}
            priority
          />
        )}
        {!!noEntityTitle && <EmptyState>{noEntityTitle}</EmptyState>}
        <VStack gap={{ md: 8, base: 2 }}>
          <Text fontWeight="bold" fontSize={{ base: "22px", md: "28px" }}>
            {title}
          </Text>
          <Button
            display={{
              base: "none",
              md: "flex",
            }}
            as={!onClick ? Link : undefined}
            href={!onClick ? link : undefined}
            onClick={onClick}
            size="lg"
            borderColor="primary.500"
            color="primary.500"
            variant="outline"
            rightIcon={icon || <PlusIcon width="24px" strokeWidth="2px" />}
            isDisabled={disabled}
          >
            {btnText}
          </Button>
          <Text display={{ base: "flex", md: "none" }} fontSize="16px">
            {btnText}
          </Text>
        </VStack>
      </VStack>
    </CenterLayout>
  );
};
