import { NextRequest, NextResponse } from 'next/server';
import { verifyStateCookie, clearStateCookie } from '../../../../lib/auth/state';
import { exchangeCodeForToken, fetchGitHubUser, isUsernameAllowed } from '../../../../lib/auth/github';
import { createSessionToken, setSessionCookie } from '../../../../lib/auth/session';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // NextRequest headers are standard Headers, which verifyStateCookie supports
  const cookieState = verifyStateCookie(request);
  
  if (!code || !state || state !== cookieState) {
    const res = NextResponse.json(
      { error: { code: 'STATE_MISMATCH', message: 'OAuth state validation failed.' } },
      { status: 400 },
    );
    clearStateCookie(res);
    return res;
  }

  try {
    const token = await exchangeCodeForToken(code);
    const user = await fetchGitHubUser(token);

    if (!isUsernameAllowed(user.login)) {
      const res = NextResponse.json(
      { error: { code: 'UNAUTHORIZED_USER', message: 'GitHub account is not authorized.' } },
      { status: 401 },
    );
    clearStateCookie(res);
    return res;
    }

    const sessionToken = await createSessionToken({
      sub: user.id,
      username: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
    });

    const returnToCookie = request.cookies.get('oauth_return_to')?.value;
    const targetPath = returnToCookie && returnToCookie.startsWith('/') && !returnToCookie.startsWith('//')
      ? returnToCookie
      : '/';

    const baseUrl = new URL(targetPath, request.url).toString();
    const res = NextResponse.redirect(baseUrl);
    
    setSessionCookie(res, sessionToken);
    clearStateCookie(res);
    res.cookies.delete('oauth_return_to');
    
    return res;
  } catch (error: any) {
    console.error('OAuth Error:', error);
    const status = error.name === 'OAuthExchangeError' ? 502 : 503;
    const res = NextResponse.json({ error: error.message || 'Service Unavailable' }, { status });
    clearStateCookie(res);
    return res;
  }
}
