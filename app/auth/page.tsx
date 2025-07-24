import { serializeOauthStateCookie } from "app/auth/utils";
import { AUTH_TOKEN_KEY } from "lib/auth";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { AuthWizard } from "./components/AuthWizard";

export const setAuthCookie = async (token: string) => {
  "use server";
  (await cookies()).set(AUTH_TOKEN_KEY, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 14, // 14 days
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax", // Use 'none' for cross-site cookies
    secure: process.env.NODE_ENV === "production", // must be HTTPS with SameSite=None
  });
};

export default async function Auth() {
  const { instance } = (await serializeOauthStateCookie().catch((e) => ({
    instance: null,
  }))) as { instance: string | null };
  return (
    <Suspense>
      <AuthWizard onSignIn={setAuthCookie} oAuthInstance={instance} />
    </Suspense>
  );
}
