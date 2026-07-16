import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '../../../../lib/auth/session';
import { SESSION_COOKIE_NAME } from '../../../../lib/auth/constants';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    // No session cookie present – return unauthenticated response
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  try {
    const payload = await verifySessionToken(token);
    return NextResponse.json({
      user: {
        username: payload.username,
        name: payload.name,
        avatarUrl: payload.avatarUrl,
      },
      authenticated: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INVALID_SESSION', message: 'Session token is invalid' } },
      { status: 401 }
    );
  }
}
