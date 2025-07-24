import { serializeOauthStateCookie } from "app/auth/utils";
import { fetchProfile } from "app/console/components/ConsoleLayout.server";
import { AUTH_TOKEN_KEY } from "lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthWizard } from "./components/AuthWizard";

export const setAuthCookie = async (token: string) => {
  "use server";
  (await cookies()).set(AUTH_TOKEN_KEY, token, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 14, // 14 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use 'none' for cross-site cookies
    secure: false, // must be HTTPS with SameSite=None
  });
};

export default async function Auth() {
  const { instance } = (await serializeOauthStateCookie().catch((e) => ({
    instance: null,
  }))) as { instance: string | null };

  const profile = await fetchProfile();
  if (profile) return redirect("/console");

  return (
    <Suspense>
      <AuthWizard onSignIn={setAuthCookie} oAuthInstance={instance} />
    </Suspense>
  );
}
