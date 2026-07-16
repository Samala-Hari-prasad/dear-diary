import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "./lib/auth/session";
import { SESSION_COOKIE_NAME } from "./lib/auth/constants";

const PROTECTED_API_PREFIXES = ["/api/v1/diary"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedApi) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    try {
      await verifySessionToken(token);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
