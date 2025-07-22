"use client";
import {
  Avatar,
  Divider,
  HStack,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { useCurrentCommunity } from "app/console/communities/[community]/components/community-validator-layout";
import { useCurrentTier } from "app/console/communities/[community]/tiers/components/TierValidatorLayout";
import { CenterLayout } from "app/console/components/CenterLayout";
import ClockIconVector from "assets/icons/clock.svg?react";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useUpdateBreadcrumb } from "states/console/breadcrumb";

const ClockIcon = chakra(ClockIconVector);

const dummyData = [
  {
    id: 1,
    type: "Custom amount",
    price: 12,
    frequency: "Once",
    date: new Date(),
  },
  {
    id: 2,
    type: "Custom amount",
    price: 12,
    frequency: "Once",
    date: new Date(),
  },
  {
    id: 3,
    type: "XYZ tier",
    price: 12,
    frequency: "Monthly",
    date: new Date(),
  },
];
type Donation = {
  type: string;
  price: number;
  frequency: string;
  date: Date;
};
const DonateCard: FC<Donation> = ({ type, price, frequency, date }) => {
  return (
    <HStack
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
          base: 2,
          md: 6,
        }}
      >
        <Text
          textStyle={{ md: "regular20", base: "medium14" }}
          minW={{ md: "120px", base: "80px" }}
          maxW={{ md: "120px" }}
          w="full"
        >
          {type}
        </Text>
        <HStack
          gap={{
            base: 2,
            md: 3,
          }}
          flexGrow={1}
        >
          <Divider
            h="18px"
            borderColor="secondary.500"
            borderWidth={{ base: "1px", md: "2px" }}
            orientation="vertical"
          />
          <Text
            textStyle={{
              md: "bold20",
              base: "bold14",
            }}
          >
            {price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </Text>
          <Text
            textStyle={{
              md: "medium20",
              base: "medium12",
            }}
            textTransform="capitalize"
            pl={{
              base: 1,
              md: 3,
            }}
          >
            {frequency}
          </Text>
        </HStack>
      </HStack>
      <Text
        textStyle={{
          md: "regular16",
          base: "regular10",
        }}
        color="brand.black.3"
      >
        {format(date, "yyyy/M/dd")}
      </Text>
    </HStack>
  );
};

export default function DonorPage() {
  const tier = useCurrentTier();
  const community = useCurrentCommunity();
  const pathname = usePathname();

  const user = {
    email: "sarah@fou.me",
    name: "Kate",
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
  };

  useUpdateBreadcrumb({
    breadcrumb: [
      {
        title: `${community.name} community`,
        link: `/console/communities/${community.id}/`,
      },
      {
        title: `${user.name}'s history`,
        link: pathname,
      },
    ],
    title: `${user.name} History`,
    back: {
      title: "Donors",
      link: `/console/communities/${community.id}/tiers/${tier.id}`,
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
      <HStack
        gap={{
          base: "4",
          md: "8",
        }}
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
            src={user.avatar}
          />
          <Text textStyle={{ md: "bold20", base: "bold14" }} isTruncated>
            {user.name || user.email}
          </Text>
        </HStack>
        <ClockIcon
          w="24px"
          display={{
            md: "none",
          }}
        />
      </HStack>
      <VStack
        w="full"
        gap={{
          md: "6",
          base: 4,
        }}
      >
        {dummyData.map((donation, i) => {
          return <DonateCard key={donation.id} {...donation} />;
        })}
      </VStack>
    </CenterLayout>
  );
}
