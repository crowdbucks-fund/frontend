import { NextResponse, type NextRequest } from "next/server";
import { withQuery } from "ufo";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const redirectUrlJSON = request.cookies.get('redirect_url')?.value;
  if (redirectUrlJSON) {
    try {
      // keep the query params
      const redirectUrl = JSON.parse(redirectUrlJSON)?.redirectUrl;
      const response = NextResponse.redirect(withQuery(new URL(redirectUrl, request.url).toString(), Object.fromEntries(request.nextUrl.searchParams.entries())));
      response.cookies.delete('redirect_url');
      return response;
    } catch {
      // if reading redirect_url fails, just continue and clear the cookie
      const response = NextResponse.next();
      response.cookies.delete('redirect_url');
      return response;
    }
  }

  return NextResponse.next();
}

// export const config = {
//   //   matcher: ["/:path*"],
//   //   // runtime: "experimental-edge",
//   unstable_allowDynamic: ["/node_modules/@protobufjs/**"],
// };
