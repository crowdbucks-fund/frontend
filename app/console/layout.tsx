import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import { PropsWithChildren } from "react";
import ConsoleLayout from "./components/ConsoleLayout";
import "./styles.css";

export default function ConsoleMainLayout({ children }: PropsWithChildren) {
  const getProfilePromise = fetchProfile();

  return (
    <ConsoleLayout
      publicPage={false}
      getProfilePromise={getProfilePromise}
      authRequired
    >
      {children}
    </ConsoleLayout>
  );
}
