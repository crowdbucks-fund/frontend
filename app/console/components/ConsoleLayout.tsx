import { GetProfileResult } from "@xeronith/granola/core/spi";
import { api } from "lib/api";
import { AUTH_TOKEN_KEY } from "lib/auth";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";
import ConsoleLayoutClient from "./ConsoleLayout.client";

export const getAuthTokenFromCookie = async () => {
  "use server";
  const token = (await cookies()).get(AUTH_TOKEN_KEY)?.value;
  return token;
};

let _profilePromise: Promise<GetProfileResult | null> = null!;
const getUserProfile = async (token: string) => {
  if (_profilePromise) return await _profilePromise;
  _profilePromise = api.getProfile({}, { token }).catch(() => null);
  return await _profilePromise;
};

export default async function ConsoleLayout({
  children,
  publicPage,
}: PropsWithChildren<{ publicPage?: boolean }>) {
  const currentAuthToken = await getAuthTokenFromCookie();
  const userProfile = currentAuthToken
    ? await getUserProfile(currentAuthToken)
    : null;
  return (
    <ConsoleLayoutClient userProfile={userProfile} publicPage={publicPage}>
      {children}
    </ConsoleLayoutClient>
  );
}
