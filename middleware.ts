import { AUTH_TOKEN_KEY } from "lib/auth";
import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/console")
  ) {
    const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
    const isUserLoggedIn = !!token;

    if (request.nextUrl.pathname.startsWith("/auth/logout")) {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/auth")) {
      if (isUserLoggedIn) {
        return NextResponse.redirect(new URL("/console", request.url));
      }
    }

    if (request.nextUrl.pathname.startsWith("/console")) {
      if (!isUserLoggedIn) {
        {
          return NextResponse.redirect(new URL("/auth", request.url));
        }
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/console/:path*"],
  // runtime: "experimental-edge",
  unstable_allowDynamic: ["/node_modules/@protobufjs/**"],
};
