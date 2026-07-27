import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
  
  // Generate 32 random bytes for state
  const state = crypto.randomBytes(32).toString("hex");
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo&state=${state}`;
  
  const response = NextResponse.redirect(githubAuthUrl);
  
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60, // 10 minutes
    path: "/",
  });
  
  return response;
}
