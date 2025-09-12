"use client";

import { Avatar, HStack, Text, VStack, chakra } from "@chakra-ui/react";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { useCurrentTier } from "app/console/communities/[community]/tiers/components/TierValidatorLayout";
import { CenterLayout } from "app/console/components/CenterLayout";
import ClockIconVector from "assets/icons/clock.svg?react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";

const ClockIcon = chakra(ClockIconVector);

const dummyData = [
  {
    email: "sarah@fou.me",
    name: "Sarah",
    avatar: "https://randomuser.me/api/portraits/women/34.jpg",
  },
  {
    email: "anthoney@fou.me",
    name: "Anthoney",
    avatar: "https://randomuser.me/api/portraits/men/84.jpg",
  },
  {
    email: "robert@gmail.com",
    avatar: "https://randomuser.me/api/portraits/men/24.jpg",
  },
  {
    email: "jax@fou.me",
    avatar: "https://randomuser.me/api/portraits/men/38.jpg",
  },
];

const UserDonationCard: FC<{
  name?: string;
  email: string;
  avatar?: string;
}> = ({ email, name, avatar }) => {
  const community = useCurrentCommunity();
  const tier = useCurrentTier();
  return (
    <HStack
      as={NextLink}
      href={`/console/communities/${community.id}/tiers/${tier.id}/donor/${email}`}
      gap="8"
      justifyContent="space-between"
      w="full"
      bg="white"
      p={{
        base: "4",
        md: "8",
      }}
      rounded={{
        base: "12px",
        md: "18px",
      }}
    >
      <HStack
        gap={{
          base: "3",
          md: "6",
        }}
        overflow="hidden"
      >
        <Avatar
          width={{
            base: "36px",
            md: "52px",
          }}
          height={{
            base: "36px",
            md: "52px",
          }}
          src={avatar}
        />
        <Text textStyle={{ md: "bold20", base: "bold14" }} isTruncated>
          {name || email}
        </Text>
      </HStack>
      <ClockIcon
        w={{
          base: "24px",
          md: "32px",
        }}
      />
    </HStack>
  );
};

export default function TierHistoryClientPage() {
  const tier = useCurrentTier();
  const community = useCurrentCommunity();
  const pathname = usePathname();

  useUpdateBreadcrumb({
    breadcrumb: [
      {
        title: `${community.name} community`,
        link: `/console/communities/${community.id}/`,
      },
      {
        title: `${tier.name} Donors`,
        link: pathname,
      },
    ],
    title: "Donors",
    back: {
      title: "Tiers",
      link: `/console/communities/${community.id}/tiers/`,
    },
  });
  return (
    <CenterLayout
      maxW="630px"
      gap={{
        md: 16,
        base: 6,
      }}
    >
      <VStack
        w="full"
        bg="white"
        rounded={{
          base: "12px",
          md: "18px",
        }}
        p={{
          base: "4",
          md: "8",
        }}
        align="start"
        gap={{
          md: 3,
          base: 2,
        }}
      >
        <Text
          textStyle={{
            md: "bold20",
            base: "medium14",
          }}
        >
          {tier.name}
        </Text>
        <Text
          fontSize={{ base: "12px", md: "16px" }}
          textStyle={{
            base: "regular12",
            md: "regular16",
          }}
          color="brand.black.3"
        >
          {tier.subscribers || "0"} subscriber{tier.subscribers != 1 ? "s" : ""}{" "}
          <Text
            textStyle={{
              base: "regular12",
              md: "regular16",
            }}
            as="span"
            ml="2"
            pl="2"
            borderLeft="2px solid"
            borderLeftColor="primary.500"
            textTransform="lowercase"
          >
            ${tier.amount} per {tier.tierFrequency?.unit}
          </Text>
        </Text>
      </VStack>
      <VStack
        w="full"
        gap={{
          md: "6",
          base: 4,
        }}
      >
        {dummyData.map((user) => {
          return <UserDonationCard key={user.email} {...user} />;
        })}
      </VStack>
    </CenterLayout>
  );
}
