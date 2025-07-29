import { GetProfileResult } from "@xeronith/granola/core/spi";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import ConsoleLayoutClient from "./ConsoleLayout.client";

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
  const user = await getProfilePromise;
  if (authRequired && !user) return redirect("/auth");
  return (
    <ConsoleLayoutClient user={user} publicPage={publicPage}>
      {children}
    </ConsoleLayoutClient>
  );
}
