"use client";

import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { Container } from "app/(public-pages)/_components/Container";
import {
  Ellipsis,
  Vector1,
  Vector2,
} from "app/(public-pages)/_components/Shapes";
import ArrowSquareRight from "assets/icons/arrow-square-right.svg?react";
import MoneyPocketImage from "assets/images/monkey-pocket.png";
import { scrollAnimate } from "lib/framerMotion";
import Image from "next/image";
import Link from "next/link";

export const AstroSection = () => {
  return (
    <Container py="140px">
      <Flex
        flexDirection={{
          base: "column-reverse",
          md: "row",
        }}
        justify="space-between"
        gap={"60px"}
        position="relative"
      >
        <Box
          position="relative"
          display="flex"
          justifyContent="center"
          zIndex={1}
          w="full"
          {...scrollAnimate("fadeInLeft", "resetDelayed1")}
        >
          <Image
            width={470}
            src={MoneyPocketImage}
            priority
            alt="CrowdBucks astronaut"
          />
        </Box>

        <VStack align="start" gap="10">
          <VStack
            gap="5"
            align={{
              base: "center",
              md: "start",
            }}
            lineHeight="normal"
          >
            <Box {...scrollAnimate("fadeInBottom", "reset")}>
              <Text
                textStyle={{
                  base: "bold30",
                  md: "bold58",
                }}
                maxW="400px"
                textAlign={{
                  base: "center",
                  md: "left",
                }}
                maxWidth={{
                  base: "200px",
                  md: "400px",
                }}
              >
                For everyone, in any planet
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
                lineHeight={{
                  base: "24px",
                  md: "32px",
                }}
              >
                CrowdBucks helps Fediverse server operators (sysops),
                open-source software developers, creators, and others build
                sustainable revenue streams to help fund their work and
                services.
              </Text>
            </Box>
          </VStack>
          <Box
            {...scrollAnimate("fadeInBottom", "resetDelayed2")}
            w="full"
            display="flex"
            justifyContent={{
              base: "center",
              md: "start",
            }}
          >
            <Button
              as={Link}
              href="/auth"
              variant="outline-stroke"
              rightIcon={<ArrowSquareRight />}
              py={{
                md: "5",
                base: 3,
              }}
              px={{
                md: "6",
                base: 4,
              }}
              h="auto"
              rounded="18px"
              fontSize="18px"
            >
              Get started now
            </Button>
          </Box>
        </VStack>
        <Box
          zIndex={-1}
          {...scrollAnimate("fadeInBottom", "resetDelayed2")}
          position="absolute"
          left="-130px"
          top={{
            base: "-170px",
            md: "-80px",
          }}
        >
          <Vector1 w="450px" />
        </Box>
        <Box
          zIndex={-1}
          {...scrollAnimate("fadeInBottom", "resetDelayed2")}
          position="absolute"
          right="-450px"
          bottom={{
            base: "-170px",
            md: "-80px",
          }}
          display={{
            md: "none",
            base: "block",
          }}
        >
          <Vector2 w="650px" />
        </Box>
        <Ellipsis zIndex={-1} position="absolute" top="-400px" right="-500px" />
      </Flex>
    </Container>
  );
};
