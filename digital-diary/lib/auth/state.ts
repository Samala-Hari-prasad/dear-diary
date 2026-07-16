import { randomBytes } from 'crypto';
import { parseCookie, stringifySetCookie } from 'cookie';
import { STATE_COOKIE_NAME } from './constants';

export function generateState(): string {
  return randomBytes(16).toString('hex');
}

export function setStateCookie(res: any, state: string, appUrl: string) {
  const cookie = stringifySetCookie({
    name: STATE_COOKIE_NAME,
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 300, // 5 minutes
  });
  // Using Set-Cookie header (replace any existing)
  res.headers.set('Set-Cookie', cookie);
}

export function verifyStateCookie(req: any): string | null {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;
  const cookies = parseCookie(cookieHeader);
  return cookies[STATE_COOKIE_NAME] ?? null;
}

export function clearStateCookie(res: any) {
  const cookie = stringifySetCookie({
    name: STATE_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  res.headers.append('Set-Cookie', cookie);
}
