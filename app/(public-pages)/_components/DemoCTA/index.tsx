"use client";

import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { Container } from "app/(public-pages)/_components/Container";
import {
  YellowVector,
  YellowVector2,
} from "app/(public-pages)/_components/Shapes";
import ArrowSquareRight from "assets/icons/arrow-square-right.svg?react";
import MobileMockup from "assets/images/MobileMockup-2.png";
import { scrollAnimate } from "lib/framerMotion";
import Image from "next/image";
import Link from "next/link";

export const DemoCTA = () => {
  return (
    <Container py="10">
      <Flex
        flexDirection={{
          base: "column",
          md: "row",
        }}
        align="start"
        rounded="20px"
        w="full"
        bg="brand.secondary.4"
        position="relative"
        justify="space-between"
        overflow="hidden"
      >
        <VStack
          align={{
            base: "center",
            md: "start",
          }}
          gap="10"
          w={{ base: "full", md: "auto" }}
          p={{
            base: "35px",
            md: "60px",
          }}
          position="relative"
          zIndex={99}
        >
          <VStack gap="2" alignItems="start">
            <Text
              textStyle={{ base: "bold30", md: "bold58" }}
              textAlign={{ base: "center", md: "left" }}
            >
              Sign up today!
            </Text>
            <Text
              textStyle="regular20"
              textAlign={{
                base: "center",
                md: "left",
              }}
            >
              Join CrowdBucks and help others grow on Fediverse
            </Text>
          </VStack>

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
        </VStack>
        <Box
          alignSelf="flex-end"
          h="full"
          pr={{
            base: 0,
            md: "60px",
          }}
          w={{
            base: "full",
            md: "auto",
          }}
          position="relative"
          zIndex="2"
          display="flex"
          justifyContent="center"
          px="8"
          {...scrollAnimate("fadeInBottom", "resetDelayed2")}
        >
          <Image alt="CrowdBucks mobile app" src={MobileMockup} priority />
        </Box>
        <YellowVector position="absolute" right="0" bottom="0" />
        <YellowVector2
          position="absolute"
          top={{
            base: "auto",
            md: "-80px",
          }}
          bottom={{
            base: "50px",
            md: "auto",
          }}
          right="60px"
          w={{
            base: "300px",
            md: "500px",
          }}
        />
      </Flex>
    </Container>
  );
};
