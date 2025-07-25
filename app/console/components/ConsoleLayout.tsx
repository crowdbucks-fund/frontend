import { GetProfileResult } from "@xeronith/granola/core/spi";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import ConsoleLayoutClient from "./ConsoleLayout.client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ConsoleLayout({
  children,
  publicPage,
  getProfilePromise,
  authRequired = false,
}: PropsWithChildren<{
  publicPage?: boolean;
  getProfilePromise: Promise<GetProfileResult | null>;
  authRequired?: boolean;
}>) {
  const userProfile = await getProfilePromise;
  if (authRequired && !userProfile) return redirect("/auth");
  return (
    <ConsoleLayoutClient userProfile={userProfile} publicPage={publicPage}>
      {children}
    </ConsoleLayoutClient>
  );
}
