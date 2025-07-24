"use client";
import { Box, Button, VStack } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { UserCommunity } from "@xeronith/granola/core/objects";
import { CenterLayout } from "app/console/components/CenterLayout";
import { CommunityCard, CreateCommunityCard } from "components/CommunityCard";
import { CreateFirstEntity } from "components/FirstEntity";
import { FullPageLoading } from "components/Loading";
import { useCommunities } from "hooks/useCommunities";
import Link from "next/link";
import { FC } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";

export default function CommunitiesPage() {
  const { data: communities, isLoading } = useCommunities();
  useUpdateBreadcrumb({
    breadcrumb: [
      {
        title: "Communities",
        link: "/console/communities",
      },
    ],
  });
  return (
    <>
      {isLoading && <FullPageLoading />}
      {communities && communities.length === 0 && (
        <CreateFirstEntity
          mobileButtonText="Create Community"
          title="Start your journey now"
          btnText="Create your first community to start"
          link="/console/communities/create"
        />
      )}
      {communities && communities.length > 0 && (
        <Communities communities={communities} />
      )}
    </>
  );
}

const Communities: FC<{ communities: UserCommunity[] }> = ({ communities }) => {
  return (
    <CenterLayout maxW={{ md: "630px" }}>
      <Button
        variant="outline"
        color="brand.black.1"
        borderColor="brand.black.1"
        w="full"
        borderWidth="1px"
        justifyContent="space-between"
        rounded="12px"
        rightIcon={<PlusIcon width="20px" />}
        display={{ base: "flex", md: "none" }}
        as={Link}
        href="/console/communities/create"
        fontSize="sm"
      >
        Create Community
      </Button>
      <VStack gap={{ base: 4, md: 6 }} w="full">
        {communities.map((community) => {
          return (
            <CommunityCard
              key={community.id}
              community={community}
              href={`/console/communities/${community.id}`}
            />
          );
        })}
        <Box display={{ base: "none", md: "block" }}>
          <Link href="/console/communities/create">
            <CreateCommunityCard />
          </Link>
        </Box>
      </VStack>
    </CenterLayout>
  );
};
