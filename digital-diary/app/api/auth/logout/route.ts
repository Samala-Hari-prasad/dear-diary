import { NextResponse } from 'next/server';
import { clearSessionCookie } from '../../../../lib/auth/session';
import { clearStateCookie } from '../../../../lib/auth/state';

export async function POST() {
  const response = NextResponse.json({ loggedOut: true });
  clearSessionCookie(response);
  clearStateCookie(response);
  return response;
}
