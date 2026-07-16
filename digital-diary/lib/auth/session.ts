import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from './types';
import { NextResponse } from 'next/server';
import { getAuthConfig } from '../config/auth';
import { ConfigurationError } from './errors';
import { SESSION_COOKIE_NAME } from './constants';

function getSecretKey() {
  const { sessionSecret } = getAuthConfig();
  if (!sessionSecret) {
    throw new ConfigurationError('SESSION_SECRET is not configured');
  }
  return new TextEncoder().encode(sessionSecret);
}

export async function createSessionToken(payload: Omit<SessionPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload as unknown as SessionPayload;
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
