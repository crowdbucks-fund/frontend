"use client";
import {
  Avatar,
  Box,
  BoxProps,
  HStack,
  IconButton,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import UserEditIcon from "assets/icons/user-edit.svg?react";
import defaultAvatar from "assets/images/default-profile.png";
import { ActiveLink } from "components/Link";
import { mobileSharedLayoutMenu } from "constants/console";
import { default as Link, default as NextLink } from "next/link";
import { FC, useMemo } from "react";
import { useAuth } from "states/console/user";

export const SharedLayout: FC<BoxProps> = (props) => {
  const { user } = useAuth();
  const avatarSrc = useMemo(() => {
    return user?.avatar || defaultAvatar.src;
  }, [user?.avatar]);
  return (
    <Box
      {...props}
      display={{ base: "flex", md: "block" }}
      flexDirection="column"
    >
      <Box
        w="full"
        display="flex"
        alignItems="center"
        flexDirection="column"
        pb={{
          md: 12,
          base: 3,
        }}
        position={{
          base: "sticky",
          md: "static",
        }}
        top={0}
        bg="brand.gray.3"
        zIndex={1}
      >
        <Avatar
          as={NextLink}
          href="/console/edit-profile"
          src={avatarSrc}
          display={{
            base: "block",
            md: "none",
          }}
          w={{ base: "80px", md: "100px", lg: "130px" }}
          h={{ base: "80px", md: "100px", lg: "130px" }}
          position={{
            base: "static",
            md: "absolute",
          }}
          left="50%"
          transform={{
            base: "unset",
            md: "translate(-50%, -87%)",
            lg: "translate(-50%, -83%)",
          }}
        />
        <Portal>
          <Avatar
            as={NextLink}
            href="/console/edit-profile"
            display={{
              base: "none",
              md: "block",
            }}
            src={avatarSrc}
            w={{ md: "100px", lg: "130px" }}
            h={{ md: "100px", lg: "130px" }}
            position={{
              md: "absolute",
            }}
            left="50%"
            transform={{
              md: "translate(-50%, -87%)",
              lg: "translate(-50%, -83%)",
            }}
            top={{
              md: "190px",
              lg: "195px",
            }}
          />
        </Portal>
        <VStack display={{ md: "none" }} w="full">
          <HStack justifyContent="center" py="3" gap={{ base: 0, md: 2 }}>
            <IconButton
              as={NextLink}
              href="/console/edit-profile"
              aria-label="edit profile"
              variant="ghost"
            >
              <UserEditIcon />
            </IconButton>
            {user?.displayName ? (
              <Text fontSize="16px" fontWeight="bold">
                {user?.displayName}
              </Text>
            ) : (
              <Link href="/console/edit-profile">
                <Text fontSize="16px" fontWeight="bold">
                  What do we call you?
                </Text>
              </Link>
            )}
          </HStack>
          {/* <CenterLayout> */}
          <HStack w="full" p={1} rounded="md" bg="white">
            {mobileSharedLayoutMenu.map((menu) => {
              return (
                <ActiveLink
                  key={menu.title}
                  href={menu.link}
                  flexGrow={1}
                  maxW="33%"
                  p={1}
                  rounded="md"
                  textAlign="center"
                  fontSize="14px"
                  activeProps={{
                    bg: "primary-glass.500",
                    fontWeight: "bold",
                  }}
                >
                  {menu.title}
                </ActiveLink>
              );
            })}
          </HStack>
          {/* </CenterLayout> */}
        </VStack>
      </Box>
      {props.children}
    </Box>
  );
};
