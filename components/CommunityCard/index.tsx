"use client";
import {
  Avatar,
  Button,
  HStack,
  IconButton,
  Text,
  Tooltip,
  VStack,
  chakra,
  useClipboard,
} from "@chakra-ui/react";
import { AddOrUpdateCommunityByUserRequest } from "@xeronith/granola/core/spi";
import ShareCommunityIcon from "assets/icons/Share my community.svg?react";
import AddIcon from "assets/icons/add-square.svg?react";
import { Edit2Icon, EditIcon } from "lucide-react";
// import EditCommunityIcon from "assets/icons/user-edit.svg?react";
import defaultAvatar from "assets/images/default-avatar.png";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";
import {
  generateCommunityLink,
  getCommunityLink,
  linkCoppiedCallback,
} from "utils/community";

export type CommunityCardProps = {
  community: AddOrUpdateCommunityByUserRequest;
  href?: string;
};

const ShareIcon = chakra(ShareCommunityIcon);

export const CommunityCard: FC<CommunityCardProps> = ({ community, href }) => {
  const communityLink = generateCommunityLink(community.handle);
  const { onCopy, hasCopied } = useClipboard(communityLink);
  const router = useRouter();
  const handleOnClick = () => {
    if (href) router.push(href);
  };
  return (
    <VStack
      cursor={href ? "pointer" : "default"}
      _hover={{ textDecoration: "none" }}
      fontWeight="normal"
      h="auto"
      p={{
        md: 8,
        base: 4,
      }}
      bg="white"
      borderRadius="xl"
      w="full"
      display="flex"
      flexDirection={"column"}
      alignItems="start"
      gap={3}
      onClick={handleOnClick}
    >
      <HStack justify="space-between" w="full">
        <HStack w="full" align="center" gap={4} overflow="hidden">
          <Avatar
            w={{ base: "36px", md: "52px" }}
            h={{ base: "36px", md: "52px" }}
            src={community.avatar || defaultAvatar.src}
          />
          <VStack align="start" gap={0} overflow="hidden">
            <HStack w="full" align="center" gap={0}>
              <Tooltip placement="top" label="Edit Community">
                <IconButton
                  display={{
                    base: "none",
                    md: "flex",
                  }}
                  color="brand.black.1"
                  as={NextLink}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={`/console/communities/${community.id}/edit`}
                  aria-label="edit community"
                  variant="ghost"
                  colorScheme="blackAlpha"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Text
                fontSize={{ base: "14px", md: "20px" }}
                fontWeight="bold"
                isTruncated
              >
                {community.name}
              </Text>
            </HStack>
            <Button
              pl={{
                md: "2",
              }}
              fontSize={{ base: "10px", md: "md" }}
              onClick={(e) => e.stopPropagation()}
              fontWeight="normal"
              variant="link"
              as={NextLink}
              target="_blank"
              href={getCommunityLink(community)}
            >
              {generateCommunityLink(community.handle, false)}
            </Button>
          </VStack>
        </HStack>
        <HStack>
          <Tooltip label="Edit Community" placement="top">
            <IconButton
              display={{
                base: "flex",
                md: "none",
              }}
              color="brand.black.1"
              as={NextLink}
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/console/communities/${community.id}/edit`}
              aria-label="edit community"
              variant="ghost"
              colorScheme="blackAlpha"
            >
              <Edit2Icon size="20px" />
            </IconButton>
          </Tooltip>
          <Tooltip
            placement="top"
            label={hasCopied ? "Copied" : "Copy link"}
            closeOnClick={false}
          >
            <IconButton
              onClick={(e) => {
                onCopy();
                linkCoppiedCallback(community);
                e.stopPropagation();
              }}
              aria-label="share"
              variant="ghost"
              colorScheme="blackAlpha"
              color="brand.black.1"
            >
              <ShareIcon
                w={{ base: "24px", md: "32px" }}
                h={{ base: "24px", md: "32px" }}
              />
            </IconButton>
          </Tooltip>
        </HStack>
      </HStack>
      <Text
        noOfLines={2}
        wordBreak="break-word"
        maxW="full"
        fontSize={{
          base: "12px",
          md: "md",
        }}
      >
        {community.summary}
      </Text>
    </VStack>
  );
};

export const CreateCommunityCard: FC = () => {
  return (
    <VStack
      color="brand.black.4"
      p={8}
      bg="white"
      borderRadius="18px"
      w="full"
      align="start"
      border="dashed 2px"
      borderColor="primary.500"
    >
      <HStack justify="space-between" w="full">
        <HStack w="full" align="center" gap={4}>
          <Avatar w="52px" h="52px" opacity={0.4} src={defaultAvatar.src} />
          <VStack align="start">
            <Text fontSize="20px" fontWeight="bold">
              New community
            </Text>
          </VStack>
        </HStack>
      </HStack>
      <HStack gap={4}>
        <Text flexGrow={1} noOfLines={2}>
          Click here to start building your community. Set up a space where
          supporters can contribute, and engage with you.
        </Text>
        <IconButton
          aria-label="create new community"
          color="primary.500"
          variant="ghost"
        >
          <AddIcon />
        </IconButton>
      </HStack>
    </VStack>
  );
};
