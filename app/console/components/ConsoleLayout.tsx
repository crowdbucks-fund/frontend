import { GetProfileResult } from "@xeronith/granola/core/spi";
import { PropsWithChildren } from "react";
import ConsoleLayoutClient from "./ConsoleLayout.client";

export default async function ConsoleLayout({
  children,
  publicPage,
  getProfilePromise,
}: PropsWithChildren<{
  publicPage?: boolean;
  getProfilePromise: Promise<GetProfileResult | null>;
}>) {
  const userProfile = await getProfilePromise;

  return (
    <ConsoleLayoutClient userProfile={userProfile} publicPage={publicPage}>
      {children}
    </ConsoleLayoutClient>
  );
}
