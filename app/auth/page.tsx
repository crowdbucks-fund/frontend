import { AUTH_TOKEN_KEY } from "lib/auth";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { AuthWizard } from "./components/AuthWizard";

export const setAuthCookie = async (token: string) => {
  "use server";

  (await cookies()).set(AUTH_TOKEN_KEY, token, {
    httpOnly: true,
  });
};

export default async function Auth() {
  return (
    <Suspense>
      <AuthWizard onSignIn={setAuthCookie} />
    </Suspense>
  );
}
