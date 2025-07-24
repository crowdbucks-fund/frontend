import type { Metadata } from "next";
import "./global.css";

import { api } from "lib/api";
import { AUTH_TOKEN_KEY } from "lib/auth";
import { cookies } from "next/headers";
import { platformInfo } from "platform";
// import { cache } from "react";
import { GetProfileResult } from "@xeronith/granola/core/spi";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : platformInfo.url
  ),

  title: "CrowdBucks",
};

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentAuthToken = await getAuthTokenFromCookie();
  const userProfile = currentAuthToken
    ? await getUserProfile(currentAuthToken)
    : null;

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers userProfile={userProfile}>{children}</Providers>
      </body>
    </html>
  );
}
