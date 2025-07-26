"use client";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { LogoutModal } from "app/console/edit-profile/LogoutModal";
import LogoutIcon from "assets/icons/logout.svg?react";
import UserEditIcon from "assets/icons/user-edit.svg?react";
import defaultAvatar from "assets/images/default-profile.png";
import { mobileSidebarMenu } from "constants/console";
import { useUserAuthProvider } from "hooks/useUserAuthProvider";
import { atom, useAtom } from "jotai";
import NextLink from "next/link";
import { useState } from "react";
import { useAuth } from "states/console/user";

export const moreDrawerState = atom(false);

export const MoreOptionsBottomDrawer = () => {
  const [isMoreDrawerOpen, setIsMoreDrawerOpen] = useAtom(moreDrawerState);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user } = useAuth();
  const authProvider = useUserAuthProvider();

  return (
    <>
      <Drawer
        onClose={setIsMoreDrawerOpen.bind(null, false)}
        placement={"bottom"}
        isOpen={isMoreDrawerOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <VStack py={6} gap={4}>
              <HStack w="full">
                <VStack w="full" gap={2}>
                  <Avatar
                    as={NextLink}
                    href="/console/edit-profile"
                    width="70px"
                    height="70px"
                    src={user?.avatar || defaultAvatar.src}
                    onClick={setIsMoreDrawerOpen.bind(null, false)}
                  />
                  <HStack>
                    <IconButton
                      aria-label="Edit User"
                      variant="ghost"
                      as={NextLink}
                      href="/console/edit-profile"
                      onClick={setIsMoreDrawerOpen.bind(null, false)}
                    >
                      <UserEditIcon />
                    </IconButton>
                    <Text fontWeight="bold" fontSize="16px">
                      {user?.displayName}
                    </Text>
                  </HStack>
                  <Text color="gray.700" fontSize={"14px"}>
                    {authProvider.provider}: {authProvider.value}
                  </Text>
                </VStack>
              </HStack>
              <VStack w="full" gap={3}>
                {mobileSidebarMenu.map((menuItem) => {
                  const Icon = menuItem.icon;
                  return (
                    <Button
                      as={NextLink}
                      fontWeight="medium"
                      fontSize="14px"
                      bg="brand.gray.3"
                      colorScheme="blackAlpha"
                      color="brand.black.2"
                      w="full"
                      py="6"
                      justifyContent="start"
                      variant="ghost"
                      rounded="10px"
                      leftIcon={<Icon width="18px" />}
                      rightIcon={
                        <Box position="absolute" right="13px" top="13px">
                          <ChevronRightIcon width="18px" />
                        </Box>
                      }
                      title={menuItem.title}
                      aria-label={menuItem.title}
                      key={menuItem.title}
                      href={menuItem.link}
                    >
                      {menuItem.title}
                    </Button>
                  );
                })}
                <Button
                  fontWeight="medium"
                  fontSize="14px"
                  bg="red.50"
                  colorScheme="red"
                  color="red.500"
                  w="full"
                  py="6"
                  justifyContent="start"
                  variant="ghost"
                  rounded="10px"
                  leftIcon={<LogoutIcon width="18px" />}
                  title="Log out"
                  aria-label="Log out"
                  onClick={setIsLogoutModalOpen.bind(null, true)}
                >
                  Log out
                </Button>
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={setIsLogoutModalOpen.bind(null, false)}
      />
    </>
  );
};
