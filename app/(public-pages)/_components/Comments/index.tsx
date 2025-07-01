"use client";

import {
  Box,
  Button,
  Image as ChakraImage,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Container } from "app/(public-pages)/_components/Container";
import { Ellipsis } from "app/(public-pages)/_components/Shapes";
import StarIcon from "assets/icons/star.svg?react";
import Coin from "assets/images/coin.png";
import { scrollAnimate } from "lib/framerMotion";
import Link from "next/link";
import { FC } from "react";

export type CommentProps = {
  image: string;
  name: string;
  href: {
    title: string;
    link: string;
  };
  comment: string;
  stars: number;
};

const comments = [
  {
    image: "/image.png",
    name: "Orlando Diggs",
    href: {
      title: "Andrew Davie",
      link: "#",
    },
    comment:
      "CrowdBucks is the only crowd-funding service that is Fediverse-native.",
    stars: 5,
  },
  {
    image: "/image-1.png",
    name: "Orlando Diggs",
    href: {
      title: "Andrew Davie",
      link: "#",
    },
    comment:
      "CrowdBucks is the only crowd-funding service that is Fediverse-native.",
    stars: 5,
  },
  {
    image: "/image-2.png",
    name: "Orlando Diggs",
    href: {
      title: "Andrew Davie",
      link: "#",
    },
    comment:
      "CrowdBucks is the only crowd-funding service that is Fediverse-native.",
    stars: 5,
  },
];

export const Comment: FC<CommentProps> = (props) => {
  return (
    <VStack
      bg="white"
      boxShadow="34px 30px 90px 0px rgba(219, 236, 234, 0.51)"
      flexGrow={1}
      px="8"
      py="10"
      rounded="20px"
      border="1px solid"
      borderColor="primary-glass.500"
      w="full"
      gap="4"
      {...scrollAnimate("fadeInBottom", "resetDelayed2")}
    >
      <VStack>
        <Image
          width="160px"
          height="160px"
          rounded="full"
          src={props.image}
          alt={props.name}
        />
        <Text textAlign="center" as="span" textStyle="regular20">
          {props.name}
        </Text>
        <Button
          textStyle="medium16"
          textDecoration="underline"
          as={Link}
          variant="link"
          color="brand.black.4"
          fontWeight="medium"
          textUnderlineOffset={3}
          href={props.href.link}
        >
          {props.href.title}
        </Button>
      </VStack>
      <VStack gap="7">
        <Text textAlign="center" as="span" textStyle="regular16">
          {props.comment}
        </Text>
        <HStack gap={1}>
          {[...Array(props.stars).keys()].map((i) => {
            return <StarIcon key={i} />;
          })}
        </HStack>
      </VStack>
    </VStack>
  );
};

export const Comments = () => {
  return (
    <Container py="100px" pt="50px">
      <VStack
        w="full"
        gap={{
          base: "50px",
          md: "60px",
        }}
        position="relative"
      >
        <VStack w="full" gap={5}>
          <Box {...scrollAnimate("fadeInBottom", "resetDelayed1")}>
            <Text
              textStyle={{
                base: "bold30",
                md: "bold38",
              }}
              textAlign={{
                base: "center",
                md: "left",
              }}
            >
              What others say
            </Text>
          </Box>
          <Box {...scrollAnimate("fadeInBottom", "resetDelayed1")}>
            <Text
              textStyle={{
                base: "regular16",
                md: "regular20",
              }}
              textAlign={{
                base: "center",
                md: "left",
              }}
            >
              See others experience with CrowdBucks and make your choice!
            </Text>
          </Box>
        </VStack>
        <Flex
          gap="8"
          align="stretch"
          flexDirection={{
            base: "column",
            md: "row",
          }}
          w="full"
        >
          {comments.map((comment, i) => {
            return <Comment key={i} {...comment} />;
          })}
        </Flex>
        <Box
          {...scrollAnimate("fadeInLeft", "resetDelayed2")}
          position="absolute"
          top="10px"
          width="24px"
          left="30%"
          display={{
            base: "none",
            md: "block",
          }}
        >
          <ChakraImage
            src={Coin.src}
            alt="Coin"
            width={{ base: "20px", md: "24px" }}
          />
        </Box>
        <Ellipsis position="absolute" top="-200px" left="-600px" zIndex={-1} />

        <ChakraImage
          src={Coin.src}
          alt="Coin"
          width={{ base: "20px", md: "24px" }}
          display={{ base: "block", md: "none" }}
          position="absolute"
          bottom={-10}
          right="20px"
        />
      </VStack>
    </Container>
  );
};
