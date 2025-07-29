"use client";
import {
  Box,
  BoxProps,
  Button,
  Container,
  HStack,
  IconButton,
  Image,
  Link,
  Text,
  Tooltip,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { GetCommunityByUserResult } from "@xeronith/granola/core/spi";
import ShareSVGIcon from "assets/icons/Share my community.svg?react";
import UserEditIcon from "assets/icons/user-edit.svg?react";
import defaultAvatar from "assets/images/default-avatar.svg";
import { useCopyCommunityLink } from "hooks/useCopyCommunityLink";
import NextLink from "next/link";
import { FC } from "react";
import { Community } from "types/Community";
import {
  generateCommunityLink,
  getCommunityLink,
  linkCoppiedCallback,
} from "utils/community";
import { createFilePath } from "utils/files";

const ShareIcon = chakra(ShareSVGIcon);

export type CommunityPreviewProps = {
  community: Community;
  editButton?: boolean;
  showSummary?: boolean;
  compact?: boolean;
  shareCommunity?: boolean;
} & BoxProps;

const EditCommunityIcon = chakra(UserEditIcon);

export const CommunityPreview: FC<CommunityPreviewProps> = ({
  community,
  editButton = false,
  showSummary = false,
  compact = false,
  shareCommunity = false,
  ...props
}) => {
  const { onCopy, hasCopied } = useCopyCommunityLink(community);
  return (
    <Box {...props} w="full">
      <Box w="full">
        <Box
          bg="#9CA3AF"
          width="100%"
          w="full"
          aspectRatio={{
            base: 171 / 82,
            lg: 171 / 62,
            xl: 171 / 52,
          }}
          rounded="12px"
          border="1px solid"
          borderColor="brand.gray.2"
          position="relative"
        >
          {community.banner && (
            <Image
              src={createFilePath(community.banner)}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              alt={`${community.name}'s banner`}
              rounded="12px"
              objectFit="cover"
              w="full"
              h="full"
            />
          )}
        </Box>
        <Image
          border="3px solid white"
          bg="white"
          src={
            !community.avatar
              ? defaultAvatar.src
              : createFilePath(community.avatar)
          }
          zIndex={99}
          position="relative"
          rounded="full"
          w={{ base: "80px", md: compact ? "98px" : "130px" }}
          h={{ base: "80px", md: compact ? "98px" : "130px" }}
          mt={{ base: "-40px", md: compact ? "-50px" : "-65px" }}
          ml={{ base: "4", md: "6" }}
        />
      </Box>
      <VStack
        pl={{ base: "4", md: "6" }}
        align="start"
        gap={0}
        pt={{ md: "4", base: 1 }}
      >
        <HStack justify="space-between" w="full">
          <HStack
            h="full"
            justifyContent="space-between"
            flexGrow={1}
            alignItems="start"
          >
            <VStack align="start" gap={0}>
              <HStack gap={1}>
                {editButton && (
                  <IconButton
                    display={{ base: "none", md: "flex" }}
                    as={NextLink}
                    href={`/console/edit`}
                    aria-label="edit community"
                    colorScheme="blackAlpha"
                    variant="ghost"
                    color="brand.black.1"
                    size="sm"
                  >
                    <UserEditIcon />
                  </IconButton>
                )}
                <Text fontWeight="bold" fontSize={{ base: "16px", md: "20px" }}>
                  {community.name}
                </Text>
              </HStack>
              <Link
                target="_blank"
                as={NextLink}
                href={getCommunityLink(community)}
                fontWeight="normal"
                fontSize={{ base: "10px", md: "16px" }}
                color="brand.black.3"
              >
                {generateCommunityLink(community.handle, false)}
              </Link>
            </VStack>

            <Button
              display={{
                base: "none",
                md: "flex",
                // md: "flex",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
                linkCoppiedCallback(community);
              }}
              leftIcon={<ShareIcon />}
              variant="ghost"
              fontWeight="medium"
              fontSize="20px"
            >
              {!compact && "Share profile"}
            </Button>
          </HStack>

          <HStack gap={1}>
            {editButton && (
              <IconButton
                display={{ base: "flex", md: "none" }}
                as={NextLink}
                href={`/console/edit`}
                aria-label="edit community"
                colorScheme="blackAlpha"
                variant="ghost"
                color="brand.black.1"
              >
                <EditCommunityIcon width={{ base: "24px", md: "32px" }} />
              </IconButton>
            )}
            {shareCommunity && (
              <Tooltip
                placement="top"
                label={hasCopied ? "Copied" : "Copy link"}
                closeOnClick={false}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy();
                    linkCoppiedCallback(community);
                  }}
                  display={{ base: "flex", md: "none" }}
                  aria-label="edit community"
                  colorScheme="blackAlpha"
                  variant="ghost"
                  color="brand.black.1"
                >
                  <ShareIcon width={{ base: "24px", md: "32px" }} />
                </IconButton>
              </Tooltip>
            )}
          </HStack>
        </HStack>
        {showSummary && (
          <Text
            color="brand.black.1"
            fontSize={{ base: "12px", md: "22px" }}
            py={{ base: 2, md: 4 }}
            maxW="full"
          >
            {community.summary}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export const CommunityPreviewSlim: FC<{
  community: GetCommunityByUserResult;
}> = ({ community }) => {
  const { onCopy, hasCopied } = useCopyCommunityLink(community);
  const copy = () => {
    onCopy();
    linkCoppiedCallback(community);
  };
  return (
    <Container w="full" variant="gray">
      <VStack alignItems="start" gap={{ base: 8, md: 8 }}>
        <HStack justifyContent="space-between" w="full">
          <HStack gap={6}>
            <Image rounded="full" src={community.avatar || defaultAvatar.src} />
            <VStack gap={0} alignItems="start">
              <HStack>
                <Text textStyle="bold20">{community.name}</Text>
                <Box w="2.5px" rounded="full" h="18px" bg="secondary.500" />
                <Text textStyle="regular20">{community.handle}</Text>
              </HStack>
              <Text
                textStyle="hint"
                as={NextLink}
                href={getCommunityLink(community)}
              >
                {generateCommunityLink(community.handle, false)}
              </Text>
            </VStack>
          </HStack>
          <Tooltip
            closeOnClick={false}
            placement="top"
            label={hasCopied ? "Copied" : "Copy Link"}
          >
            <IconButton
              onClick={copy}
              aria-label="share profile"
              variant="ghost"
              width="24px"
              size="sm"
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </HStack>
        <Text textStyle="regular18">{community.summary}</Text>
      </VStack>
    </Container>
  );
};
