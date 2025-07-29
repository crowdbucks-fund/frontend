import { AuthUser } from "app/console/components/ConsoleLayout.server";
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
  getProfilePromise: Promise<AuthUser>;
  authRequired?: boolean;
}>) {
  const authUser = await getProfilePromise;
  if (authRequired && !authUser.profile) return redirect("/auth");
  return (
    <ConsoleLayoutClient authUser={authUser} publicPage={publicPage}>
      {children}
    </ConsoleLayoutClient>
  );
}
