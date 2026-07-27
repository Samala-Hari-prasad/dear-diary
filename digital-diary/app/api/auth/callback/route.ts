import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const storedStateCookie = request.cookies.get("oauth_state");
  const storedState = storedStateCookie?.value;

  // Clear cookie helper
  const clearState = (res: NextResponse) => {
    res.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });
    return res;
  };

  if (!code || !state || !storedState) {
    return clearState(NextResponse.json({ error: "Missing OAuth parameters" }, { status: 400 }));
  }

  // Timing safe comparison for state validation
  let isValid = false;
  try {
    isValid = crypto.timingSafeEqual(Buffer.from(state), Buffer.from(storedState));
  } catch {
    isValid = false;
  }

  if (!isValid) {
    return clearState(NextResponse.json({ error: "Invalid state" }, { status: 400 }));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      return clearState(NextResponse.json({ error: "Failed to fetch access token from GitHub" }, { status: 400 }));
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return clearState(NextResponse.json({ error: tokenData.error_description }, { status: 400 }));
    }

    const accessToken = tokenData.access_token;

    // Fetch user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const userData = await userResponse.json();

    // Create a local session
    await createSession(userData.login);
    console.log(`[Auth] Session created for user ${userData.login}`);

    return clearState(NextResponse.redirect(new URL("/", request.url)));
  } catch {
    return clearState(NextResponse.json({ error: "Authentication failed" }, { status: 500 }));
  }
}
