import type { Metadata } from "next";
import "./global.css";

import { AUTH_TOKEN_KEY } from "lib/auth";
import { cookies } from "next/headers";
import { platformInfo } from "platform";
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
  return (await cookies()).get(AUTH_TOKEN_KEY)?.value;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentAuthToken = await getAuthTokenFromCookie();
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers authToken={currentAuthToken}>{children}</Providers>
      </body>
    </html>
  );
}
