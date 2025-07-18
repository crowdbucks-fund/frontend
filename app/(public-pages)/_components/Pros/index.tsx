"use client";

import { Flex, Text, VStack } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import { Image as ChakraImage } from "@chakra-ui/react";
import { Container } from "app/(public-pages)/_components/Container";
import { Vector2 } from "app/(public-pages)/_components/Shapes";
import Coin from "assets/images/coin.png";
import FriendlyIcon from "assets/images/friendly.svg?react";
import HappyIcon from "assets/images/happy.svg?react";
import LoveIcon from "assets/images/love.svg?react";
import { scrollAnimate } from "lib/framerMotion";

export type MainPropProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

const props = [
  {
    icon: <FriendlyIcon />,
    title: "Fediverse friendly",
    description: "CrowdBucks is (actually will be) part of the Fediverse",
  },
  {
    icon: <LoveIcon />,
    title: "Made with love",
    description: "CrowdBucks is created by people who love the Fediverse",
  },
  {
    icon: <HappyIcon />,
    title: "From people you know",
    description:
      "CrowdBucks is created by individual people you know, and not a large faceless corporation",
  },
];

export const MainProp: FC<MainPropProps> = (props) => {
  return (
    <VStack
      {...scrollAnimate("fadeInBottom", "resetDelayed1")}
      bg="white"
      boxShadow="34px 30px 90px 0px rgba(219, 236, 234, 0.51)"
      flexGrow={1}
      px="8"
      py="10"
      rounded="20px"
      border="1px solid"
      borderColor="primary-glass.500"
      w="full"
      gap="8"
    >
      {props.icon}
      <VStack gap="5">
        <Text textAlign="center" as="span" textStyle="bold28">
          {props.title}
        </Text>
        <Text textAlign="center" as="span" textStyle="regular16">
          {props.description}
        </Text>
      </VStack>
    </VStack>
  );
};

export const MainProps: FC<{ showShapes?: boolean }> = ({
  showShapes = false,
}) => {
  return (
    <Container py="100px">
      <VStack
        w="full"
        gap={{
          base: "60px",
          md: "50px",
        }}
        position="relative"
      >
        <VStack
          w="full"
          gap={{
            base: 3,
            md: 5,
          }}
          {...scrollAnimate("fadeInBottom", "reset")}
        >
          <Text
            textStyle={{
              base: "bold30",
              md: "bold38",
            }}
            textAlign="center"
          >
            Built by the Fediverse, for the Fediverse
          </Text>
          <Text
            textStyle={{
              base: "regular16",
              md: "regular20",
            }}
            textAlign="center"
          >
            CrowdBucks is crafted by members of the Fediverse community,
            ensuring it stays true to the values and needs of its users.
          </Text>
        </VStack>
        <Flex
          gap="8"
          align="stretch"
          flexDirection={{
            md: "row",
            base: "column",
          }}
        >
          {props.map((prop) => {
            return <MainProp key={prop.title} {...prop} />;
          })}
        </Flex>
        {showShapes && (
          <Vector2
            right="120px"
            position="absolute"
            zIndex={-1}
            display={{
              base: "none",
              md: "block",
            }}
          />
        )}
        <ChakraImage
          src={Coin.src}
          alt="Coin"
          width={{ base: "20px", md: "24px" }}
          display={{ base: "block", md: "none" }}
          position="absolute"
          bottom={-16}
          right="20px"
        />
      </VStack>
    </Container>
  );
};
