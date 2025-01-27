import { NextRequest, NextResponse } from "next/server";
import { encrypt, verifySession } from "./servers/session";
import { userSession } from "./servers/user";
import { verifyRoute } from "./servers/permission-server";
import { parseJWT } from "./lib/utils";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const session = await verifySession();

  if (!session || !session.accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }

  const sessionUser = await userSession();
  if (!sessionUser || !sessionUser.success) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }

  const hasPermission = await verifyRoute(sessionUser.data, path);
  if (!hasPermission) {
    return NextResponse.redirect(new URL("/error-forbidden", request.nextUrl));
  }

  const response = NextResponse.next();
  const { exp } = parseJWT(session.accessToken);
  const expiresAt = new Date(exp * 1000);
  const sessionAcc = await encrypt({ accessToken: session.accessToken }, exp);
  response.cookies.set("session", sessionAcc, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$|sign-in|sign-up|error-forbidden).*)",
  ],
};
