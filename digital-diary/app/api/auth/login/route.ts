import { NextRequest, NextResponse } from 'next/server';
import { generateState, setStateCookie } from '../../../../lib/auth/state';
import { getGitHubAuthorizeUrl } from '../../../../lib/auth/github';

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get('returnTo');
  
  const state = generateState();
  const url = getGitHubAuthorizeUrl(state);
  
  const response = NextResponse.redirect(url);
  setStateCookie(response, state, '');
  
  if (returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')) {
    response.cookies.set('oauth_return_to', returnTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 300,
    });
  }
  
  return response;
}
