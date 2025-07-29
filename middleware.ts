import { AUTH_TOKEN_KEY } from "lib/auth";
import { decryptCookie } from "lib/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { withQuery } from "ufo";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/console")
  ) {
    const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
    const isUserLoggedIn = !!token;

    const redirectUrlToken = request.cookies.get('redirect_url')?.value;
    if (redirectUrlToken) {
      // keep the query params
      const redirectUrl = (await decryptCookie(redirectUrlToken)).redirectUrl
      const response = NextResponse.redirect(withQuery(new URL(redirectUrl, request.url).toString(), Object.fromEntries(request.nextUrl.searchParams.entries())));
      response.cookies.delete('redirect_url');
      return response;
    }

    if (request.nextUrl.pathname.startsWith("/auth/logout")) {
      return NextResponse.next();
    }

  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/console/:path*"],
  // runtime: "experimental-edge",
  unstable_allowDynamic: ["/node_modules/@protobufjs/**"],
};
