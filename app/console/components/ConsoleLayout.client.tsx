"use client";
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  CircularProgress,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { GetProfileResult } from "@xeronith/granola/core/spi";
import LogoutIcon from "assets/icons/logout.svg?react";
import MenuIcon from "assets/icons/menu M.svg?react";
import MoreIcon from "assets/icons/more-circle.svg?react";
import UserEditIcon from "assets/icons/user-edit.svg?react";
import defaultAvatar from "assets/images/default-profile.png";
import { ActiveLink } from "components/Link";
import { consoleMenu, sideBarMenu } from "constants/console";
import { motion } from "framer-motion";
import { useScrollRestoration } from "hooks/useScrollRestoration";
import { useUserAuthProvider } from "hooks/useUserAuthProvider";
import { useAtom, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { store } from "lib/jotai";
import Image from "next/image";
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { FC, PropsWithChildren, useState } from "react";
import { breadcrumbLinks } from "states/console/breadcrumb";
import { sidebarState } from "states/console/sidebar";
import { useAuth, userProfileSSR } from "states/console/user";
import { LogoutModal } from "../edit-profile/LogoutModal";
import {
  MoreOptionsBottomDrawer,
  moreDrawerState,
} from "./MoreOptionsBottomDrawer";

export const SplashLoading: FC = () => {
  return (
    <Box
      flexDirection="column"
      gap={6}
      minW="100vw"
      minH="100svh"
      bg="white"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <HStack>
        <CircularProgress isIndeterminate color="secondary.500" size="25px" />
        {/* <Image src="/logo-standalone.svg" alt="logo" width={100} height={100} /> */}
        {/* <Text fontWeight="bold" fontSize="20px">
          CrowdBucks
          </Text> */}
      </HStack>
      <Image src="/logo-standalone.svg" alt="logo" width={100} height={100} />
    </Box>
  );
};

export default function ConsoleLayoutClient({
  children,
  publicPage = false,
  userProfile,
}: PropsWithChildren<{
  publicPage?: boolean;
  userProfile: GetProfileResult | null;
}>) {
  useHydrateAtoms([[userProfileSSR, userProfile]], { store });
  useScrollRestoration();
  const { user, loading, isFetching } = useAuth(
    publicPage ? { onError() {} } : {}
  );
  const [isSidebarOpen, setSidebarOpen] = useAtom(sidebarState);

  const [
    { breadcrumb, title: routeTitle, back: backButton, showConsoleMenu = true },
  ] = useAtom(breadcrumbLinks);

  const setIsMoreDrawerOpen = useSetAtom(moreDrawerState);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const segments = useSelectedLayoutSegments();
  const authProvider = useUserAuthProvider();
  const isWithPreviewRoute =
    segments.includes("(with-preview)") ||
    segments.includes("(community-index)");
  if (loading) return <SplashLoading />;
  return (
    <VStack
      w="full"
      px={{ md: 8, base: 6 }}
      minH="100svh"
      bg={{ base: "brand.gray.3", md: "brand.gray.4" }}
    >
      <HStack
        w="full"
        justify="space-between"
        py={4}
        mt={2}
        position={!!user ? "static" : "relative"}
      >
        {user ? (
          <IconButton
            colorScheme="blackAlpha"
            color="black"
            display={{ base: "none", md: "flex" }}
            aria-label="Toggle Menu"
            variant="ghost"
            onClick={setSidebarOpen.bind(null, !isSidebarOpen)}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box h="40px" />
        )}

        <Box display={{ base: "flex", md: "none" }}>
          {
            backButton && user ? (
              <Button
                variant="unstyled"
                display="flex"
                alignItems="center"
                color="primary.500"
                fontWeight="normal"
                fontSize="14px"
                textTransform="capitalize"
                as={NextLink}
                href={backButton.link}
              >
                <Box mr="1">
                  <ChevronLeftIcon width="22px" />
                </Box>
                {backButton.title}
              </Button>
            ) : null
            // user && (
            //   <IconButton
            //     as={ActiveLink}
            //     href="/console/settings"
            //     colorScheme="blackAlpha"
            //     color="black"
            //     display={{ base: "flex", md: "none" }}
            //     aria-label="Settings Menu"
            //     variant="ghost"
            //   >
            //     <SettingsIcon />
            //   </IconButton>
            // )
          }
        </Box>

        <Box
          position="absolute"
          left={"50%"}
          transform="translateX(-50%)"
          display={{ base: "none", md: "block" }}
        >
          <Image
            priority
            src="/logo.svg"
            alt="CrowdBucks Logo"
            width={130}
            height={42}
          />
        </Box>

        <Box
          position="absolute"
          left={!!user ? "50%" : "0"}
          transform={!!user ? "translateX(-50%)" : undefined}
          display={{ base: "block", md: "none" }}
        >
          {routeTitle ? (
            <Text
              fontWeight="bold"
              fontSize="14px"
              isTruncated
              maxW="calc(100vw - 215px)"
            >
              {routeTitle}
            </Text>
          ) : (
            <Image
              priority
              src="/logo-standalone.svg"
              alt="CrowdBucks Logo"
              width={120}
              height={35}
            />
          )}
        </Box>

        {user ? (
          <IconButton
            onClick={setIsMoreDrawerOpen.bind(null, true)}
            colorScheme="blackAlpha"
            color="black"
            display={{ base: "flex", md: "none" }}
            aria-label="Settings Menu"
            variant="ghost"
          >
            <MoreIcon />
          </IconButton>
        ) : (
          <Button
            as={NextLink}
            href="/auth"
            size="sm"
            variant="solid"
            fontSize={{ base: "10px", md: "14px" }}
            px={{ base: 2, md: 3 }}
            h={{ base: "28px", md: "34px" }}
            fontWeight="bold"
            colorScheme="primary"
            rounded="10px"
            isLoading={isFetching}
            display={{ base: "flex", md: "none" }}
          >
            {user ? "Get started" : "Join CrowdBucks Now"}
          </Button>
        )}
      </HStack>
      <HStack
        w="full"
        justify="space-between"
        py={4}
        display={{ base: "none", md: "flex" }}
      >
        <HStack gap={2}>
          {user && !loading && (
            <Text fontWeight="bold" fontSize="16px" color="brand.black.1">
              {user.displayName
                ? `${user.displayName}'s Console`
                : `Your Console`}
            </Text>
          )}
          {!user && !loading && (
            <Button
              as={NextLink}
              href="/auth"
              size="sm"
              variant="solid"
              fontSize={{ base: "10px", md: "14px" }}
              px={{ base: 2, md: 3 }}
              h={{ base: "28px", md: "34px" }}
              fontWeight="bold"
              colorScheme="primary"
              rounded="10px"
              isLoading={isFetching}
            >
              {user ? "Get started" : "Join CrowdBucks Now"}
            </Button>
          )}

          {breadcrumb && (
            <>
              <Divider
                h="15px"
                borderColor="secondary.500"
                borderWidth="1.5px"
                orientation="vertical"
              />
              <Breadcrumb
                separator={
                  <ChevronRightIcon
                    color="gray.500"
                    width="13px"
                    strokeWidth="2px"
                  />
                }
              >
                {breadcrumb.map((breadcrumb, i) => {
                  return (
                    <BreadcrumbItem key={`${breadcrumb.title}-${i}`}>
                      <BreadcrumbLink
                        as={ActiveLink}
                        textUnderlineOffset="3px"
                        href={breadcrumb.link}
                        startsWith={breadcrumb.startsWith || false}
                      >
                        {breadcrumb.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  );
                })}
              </Breadcrumb>
            </>
          )}
        </HStack>
        <HStack gap="4" height="40px">
          {user &&
            showConsoleMenu &&
            consoleMenu.map((menuItem) => {
              const Icon = menuItem.icon;
              return (
                <IconButton
                  startsWith={menuItem.link !== "/console"}
                  as={ActiveLink}
                  href={menuItem.link}
                  title={menuItem.title}
                  aria-label={menuItem.title}
                  key={menuItem.title}
                  variant="ghost"
                  prefetch={menuItem.prefetch}
                >
                  <Icon />
                </IconButton>
              );
            })}
        </HStack>
      </HStack>
      <Flex
        flexGrow={1}
        overflow="auto"
        minH={{
          base: "50vh",
          md: "auto",
        }}
        maxH={{
          // base:
          //   !!user && !!!routeTitle
          //     ? "calc(100svh - 190px)"
          //     : "calc(100svh - 90px)",
          md: "unset",
        }}
        h="full"
        w="full"
        pb="6"
        display="flex"
        flexDirection="column"
        position="relative"
      >
        <Box
          as={motion.div}
          variants={{
            open: {
              width: "280px",
              opacity: 1,
            },
            closed: {
              width: "0",
              opacity: 0,
            },
          }}
          initial="closed"
          animate={isSidebarOpen && !!user ? "open" : "closed"}
          display={{ md: "block", base: "none" }}
          position="absolute"
          h="calc(100% - 25px)"
          overflow="auto"
        >
          <VStack
            minH="full"
            width="280px"
            float="right"
            //   gap={12}
            gap={2}
            overflow="hidden"
            p="6"
            rounded="20px"
            border={{ md: "2px solid" }}
            borderColor={{ md: "brand.gray.2" }}
            bg={{ md: "brand.gray.3" }}
          >
            <VStack w="full" gap={8}>
              <Button
                display="flex"
                justifyContent="space-between"
                as={ActiveLink}
                _hover={{
                  bg: "blackAlpha.100",
                }}
                variant="ghost"
                href="/console/edit-profile"
                p="4"
                w="full"
                h="auto"
                bg="white"
                rounded="10px"
                color="brand.black.1"
                gap={2}
                activeProps={{
                  color: "brand.black.1",
                }}
                overflow="hidden"
              >
                <HStack overflow="hidden" flexGrow={1}>
                  <Avatar
                    width="36px"
                    height="36px"
                    src={
                      (user as GetProfileResult)?.avatar || defaultAvatar.src
                    }
                  />
                  <VStack
                    align="start"
                    gap="0.5"
                    flexGrow={1}
                    overflow="hidden"
                  >
                    <Text isTruncated maxW="full">
                      {(user as GetProfileResult)?.displayName}
                    </Text>
                    <Text
                      as="span"
                      fontSize="10px"
                      fontWeight="normal"
                      maxW="full"
                      isTruncated
                      color="#6B7280"
                    >
                      {authProvider.provider}:
                    </Text>
                    <Text
                      as="span"
                      fontSize="10px"
                      fontWeight="normal"
                      maxW="full"
                      isTruncated
                      color="#6B7280"
                    >
                      {authProvider.value}
                    </Text>
                  </VStack>
                </HStack>
                <Icon p={0} width="24px" h="24px">
                  <UserEditIcon />
                </Icon>
              </Button>
              <VStack w="full">
                {sideBarMenu.map((menuItem) => {
                  const Icon = menuItem.icon;
                  return (
                    <Button
                      as={ActiveLink}
                      fontWeight="medium"
                      fontSize="14px"
                      colorScheme="blackAlpha"
                      color="brand.black.3"
                      w="full"
                      py="6"
                      justifyContent="start"
                      variant="ghost"
                      rounded="10px"
                      leftIcon={<Icon width="18px" />}
                      title={menuItem.title}
                      aria-label={menuItem.title}
                      key={menuItem.title}
                      href={menuItem.link}
                      startsWith={menuItem.link !== "/console"}
                      prefetch={menuItem.prefetch}
                      activeProps={{
                        bg: "white !important",
                        fontWeight: "bold !important",
                        color: "brand.black.2 !important",
                        __css: {
                          svg: {
                            path: {
                              strokeWidth: "3px !important",
                            },
                          },
                        },
                      }}
                    >
                      {menuItem.title}
                    </Button>
                  );
                })}
              </VStack>
            </VStack>
            <Button
              fontWeight="medium"
              fontSize="14px"
              color="red"
              w="full"
              py="6"
              justifyContent="start"
              variant="ghost"
              rounded="10px"
              leftIcon={<LogoutIcon width="18px" />}
              title={"Log out"}
              aria-label={"Log out"}
              colorScheme="red"
              onClick={setIsLoggingOut.bind(null, true)}
            >
              Log out
            </Button>
            <LogoutModal
              isOpen={isLoggingOut}
              onClose={setIsLoggingOut.bind(null, false)}
            />
          </VStack>
        </Box>
        <Box
          marginLeft={{
            md: isSidebarOpen && !!user ? "300px" : "0",
            base: "0",
          }}
          transition="margin-left 0.2s ease-in-out"
          flexGrow={1}
          rounded="20px"
          border={{ md: !isWithPreviewRoute ? "2px solid" : "0" }}
          borderColor={{ md: !isWithPreviewRoute ? "brand.gray.2" : "0" }}
          bg={{ md: !isWithPreviewRoute ? "brand.gray.3" : "transparent" }}
          p={{ md: !isWithPreviewRoute ? "6" : "0" }}
          display="flex"
          flexDir="column"
        >
          {children}
        </Box>
      </Flex>
      {/* {!!user && !!!routeTitle && (
        <Box display={{ md: "none", base: "block" }} w="full">
          <Box
            display="flex"
            px={3}
            py={1}
            rounded="xl"
            bg="white"
            justifyContent="space-between"
            mb={2}
            w="full"
            position="relative"
          >
            <Box
              position="absolute"
              top="-10px"
              left="50%"
              transform="translateX(-50%)"
              bg="white"
              rounded="full"
              width="70px"
              height="70px"
            />
            {mobileNavigationMenu.map((menu) => {
              const Icon = menu.icon;
              return (
                <Button
                  p={3}
                  variant="unstyled"
                  height="auto"
                  display="flex"
                  alignItems="center"
                  key={menu.title}
                  as={ActiveLink}
                  aria-label={menu.title}
                  href={menu.link}
                  flexDirection="column"
                  width="70px"
                  prefetch={menu.prefetch}
                >
                  <Icon height={"24px"} />
                  <Text fontSize="12px" fontWeight="normal" mt={1}>
                    {menu.title}
                  </Text>
                </Button>
              );
            })}
          </Box>
        </Box>
      )} */}
      <MoreOptionsBottomDrawer />
    </VStack>
  );
}
