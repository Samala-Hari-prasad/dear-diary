import { OAuthExchangeError, GitHubUserError, ConfigurationError } from "./errors";
import { GitHubUser } from "./types";
import { getAuthConfig } from "../config/auth";

export function getGitHubAuthorizeUrl(state: string): string {
  const { githubClientId, githubRedirectUri } = getAuthConfig();
  if (!githubClientId) {
    throw new ConfigurationError("GitHub OAuth configuration is incomplete (GITHUB_CLIENT_ID missing).");
  }
  const params = new URLSearchParams({
    client_id: githubClientId,
    redirect_uri: githubRedirectUri,
    state,
    scope: "read:user",
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const { githubClientId, githubClientSecret, githubRedirectUri } = getAuthConfig();
  if (!githubClientId || !githubClientSecret) {
    throw new ConfigurationError("GitHub OAuth configuration is incomplete (client ID/secret missing).");
  }
  const body = new URLSearchParams({
    client_id: githubClientId,
    client_secret: githubClientSecret,
    code,
    redirect_uri: githubRedirectUri,
  });
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    cache: "no-store",
    headers: { Accept: "application/json" },
    body,
  });
  if (!response.ok) {
    throw new OAuthExchangeError(`GitHub token exchange failed with status ${response.status}`);
  }
  const data = await response.json();
  if (data.error) {
    throw new OAuthExchangeError(data.error_description || data.error);
  }
  if (!data.access_token) {
    throw new OAuthExchangeError("GitHub did not return an access token");
  }
  return data.access_token as string;
}

export async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch("https://api.github.com/user", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "dear-diary-app",
    },
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Could not read error text");
    console.error("GitHub User Fetch Error 502 details:", errorText, response.headers);
    throw new GitHubUserError(`Failed to fetch GitHub user: ${response.status} - ${errorText}`);
  }
  const user = await response.json();
  if (!user || !user.login) {
    throw new GitHubUserError('GitHub user response is invalid.');
  }
  return {
    id: user.id?.toString() ?? '',
    login: user.login,
    name: user.name,
    avatar_url: user.avatar_url,
  } as GitHubUser;
}

export function isUsernameAllowed(username: string): boolean {
  const { allowedGitHubUsername } = getAuthConfig();
  return Boolean(allowedGitHubUsername) && username.trim().toLowerCase() === allowedGitHubUsername.trim().toLowerCase();
}
