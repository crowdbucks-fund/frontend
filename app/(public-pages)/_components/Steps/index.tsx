"use client";

import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Container } from "app/(public-pages)/_components/Container";
import { Ellipsis, Vector2 } from "app/(public-pages)/_components/Shapes";
import HappyIcon from "assets/icons/emoji-happy.svg?react";
import Flash from "assets/icons/flash.svg?react";
import ZoomIcon from "assets/icons/search-normal.svg?react";
import UserEdit from "assets/icons/user-edit.svg?react";
import UserInfo from "assets/icons/user-tag.svg?react";
import HelperImage from "assets/images/woman invests.svg";
import FundraiserImage from "assets/images/woman received dividend payments 2.svg";
import { scrollAnimate } from "lib/framerMotion";
import Image from "next/image";
import { Fragment, useState } from "react";

const ChakraNextImage = chakra(Image);

const data = {
  helper: {
    steps: [
      {
        icon: <UserEdit />,
        title: "Join CrowdBucks",
      },
      {
        icon: <ZoomIcon />,
        title: "Find your favorite fundraiser",
      },
      {
        icon: <HappyIcon />,
        title: "Help out",
      },
    ],
    image: HelperImage,
  },
  fundraiser: {
    steps: [
      {
        icon: <UserEdit />,
        title: "Join CrowdBucks",
      },
      {
        icon: <Flash />,
        title: "Share your CrowdBucks page",
      },
      {
        icon: <UserInfo />,
        title: "Build sustainable revenue streams",
      },
    ],
    image: FundraiserImage,
  },
};

export const Steps = () => {
  const [selectedRole, setSelectedRole] = useState<keyof typeof data>("helper");

  return (
    <Container
      py={{
        base: "30px",
        md: "100px",
      }}
      id="steps"
    >
      <Text
        textStyle={{
          base: "bold30",
          md: "bold38",
        }}
        pb="4"
        textAlign={{
          base: "center",
          md: "left",
        }}
      >
        All you have to do...
      </Text>
      <Flex
        justify="space-between"
        gap={"60px"}
        position="relative"
        flexDirection={{
          base: "column-reverse",
          md: "row",
        }}
      >
        <VStack align="start" gap="10" flexGrow={1} w="full">
          <HStack
            w="full"
            justifyContent={{
              base: "center",
              md: "start",
            }}
          >
            {Object.keys(data).map((key, i) => {
              return (
                <Fragment key={key}>
                  <Button
                    bg="white"
                    border="1px solid"
                    borderColor={
                      selectedRole === key ? "brand.black.1" : "transparent"
                    }
                    key={key}
                    onClick={setSelectedRole.bind(
                      null,
                      key as typeof selectedRole
                    )}
                    fontSize="18px"
                    fontWeight={selectedRole === key ? "bold" : "regular"}
                    rounded="12px"
                    _hover={{
                      bg: "white",
                    }}
                  >
                    As a {key}
                  </Button>
                  {i !== Object.keys(data).length - 1 && (
                    <Divider
                      orientation="vertical"
                      w="1px"
                      h="25px"
                      borderColor="brand.black.1"
                    />
                  )}
                </Fragment>
              );
            })}
          </HStack>

          <VStack
            gap="3"
            flexGrow={1}
            w="full"
            {...scrollAnimate("fadeInBottom", "resetDelayed1")}
          >
            {data[selectedRole].steps.map((row) => {
              return (
                <HStack
                  key={row.title}
                  p="5"
                  w="full"
                  align="center"
                  rounded="20px"
                  border="1px solid"
                  borderColor="primary-glass.500"
                  justify="start"
                  bg="white"
                  gap="5"
                >
                  <VStack
                    p="3"
                    rounded="12px"
                    align="center"
                    justify="center"
                    bg="primary-glass.500"
                    color="primary.500"
                  >
                    {row.icon}
                  </VStack>
                  <Text
                    color="brand.black.1"
                    fontSize={{
                      base: "16px",
                      md: "20px",
                    }}
                    fontWeight="normal"
                  >
                    {row.title}
                  </Text>
                </HStack>
              );
            })}
          </VStack>
        </VStack>
        <Box
          display="flex"
          justifyContent="center"
          position="relative"
          zIndex={1}
          w="full"
          {...scrollAnimate("fadeInRight", "resetDelayed1")}
        >
          <ChakraNextImage
            src={data[selectedRole].image}
            priority
            objectFit="cover"
            objectPosition="10%"
            alt="CrowdBucks astronaut"
          />
        </Box>
        <Vector2
          position="absolute"
          zIndex={-1}
          top="-180px"
          right="-300px"
          display={{
            base: "block",
            md: "none",
          }}
        />
        <Ellipsis
          position="absolute"
          bottom={{ md: "-160%" }}
          right={{ md: "-650px" }}
          top={{
            base: "-70%",
            md: "unset",
          }}
          zIndex={-1}
        />
      </Flex>
    </Container>
  );
};
