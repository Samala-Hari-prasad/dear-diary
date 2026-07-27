import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth/jwt";

const publicRoutes = ["/login", "/api/auth/github", "/api/auth/callback"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const session = request.cookies.get("session")?.value;
  
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await decrypt(session);
    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)"],
};
