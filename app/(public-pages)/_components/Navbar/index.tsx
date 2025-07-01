"use client";

import { Box, Button, HStack, IconButton, VStack } from "@chakra-ui/react";
import { ArrowLeftIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { Container } from "app/(public-pages)/_components/Container";
import ArrowSquareRight from "assets/icons/arrow-square-right.svg?react";
import Logo from "assets/images/logo-xl.svg?react";
import { ActiveLink } from "components/Link";
import { navMenu } from "constants/home-page";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [open]);
  return (
    <Container>
      <HStack
        display={{ base: "flex", md: "none" }}
        p="0"
        h="95px"
        position={open ? "fixed" : "static"}
        w="calc(100% - 48px)"
        zIndex={1000}
      >
        <IconButton
          aria-label="menu"
          variant="ghost"
          onClick={setOpen.bind(null, !open)}
        >
          {open ? <ArrowLeftIcon width="24px" /> : <Bars3Icon width="24px" />}
        </IconButton>
        <Box position="absolute" left="50%" transform="translateX(-50%)">
          <Logo />
        </Box>
      </HStack>
      <Box
        display={open ? "block" : "none"}
        h="full"
        w="full"
        position="fixed"
        top="0"
        left={0}
        pt="100px"
        bg="brand.gray.3"
        zIndex={999}
      >
        <Container>
          <VStack gap="6" pt="40px">
            <ActiveLink
              href="/"
              activeProps={{
                color: "primary.500",
                fontWeight: "bold",
              }}
              fontSize="16px"
              fontWeight="medium"
            >
              Home
            </ActiveLink>
            <ActiveLink
              href="/contact-us"
              prefetch={false}
              activeProps={{
                color: "primary.500",
                fontWeight: "bold",
              }}
              fontSize="16px"
              fontWeight="medium"
            >
              Contact Us
            </ActiveLink>
            <ActiveLink
              href="/about"
              prefetch={false}
              activeProps={{
                color: "primary.500",
                fontWeight: "bold",
              }}
              fontSize="16px"
              fontWeight="medium"
            >
              About CrowdBucks
            </ActiveLink>
          </VStack>
        </Container>
      </Box>
      <HStack
        display={{
          base: "none",
          md: "flex",
        }}
        justify="space-between"
        w="full"
        h="120px"
        alignItems="center"
      >
        <Link href="/" aria-label="CrowdBucks home page">
          <Logo />
        </Link>
        <HStack gap="14">
          {navMenu.map((item) => {
            return (
              <ActiveLink
                key={item.title}
                variant="link"
                _hover={{
                  textDecoration: "normal",
                }}
                href={item.link}
                fontWeight="medium"
                fontSize="16px"
                color="brand.black.1"
                prefetch={false}
                activeProps={{
                  color: "primary.500",
                  fontWeight: "bold",
                }}
              >
                {item.title}
              </ActiveLink>
            );
          })}
          <Button
            as={Link}
            href="/auth"
            variant="outline-stroke"
            rightIcon={<ArrowSquareRight />}
          >
            Get started now
          </Button>
        </HStack>
      </HStack>
    </Container>
  );
};
