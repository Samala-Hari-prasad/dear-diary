import { getRequiredEnv } from "./env";

export interface AuthConfig {
  githubClientId: string;
  githubClientSecret: string;
  githubRedirectUri: string;
  sessionSecret: string;
  allowedGitHubUsername: string;
}

export function getAuthConfig(): AuthConfig {
  const githubClientId = getRequiredEnv("GITHUB_CLIENT_ID");
  const githubClientSecret = getRequiredEnv("GITHUB_CLIENT_SECRET");
  const githubRedirectUri = getRequiredEnv("GITHUB_REDIRECT_URI");
  const sessionSecret = getRequiredEnv("SESSION_SECRET");
  const allowedGitHubUsername = getRequiredEnv("ALLOWED_GITHUB_USERNAME");

  return {
    githubClientId,
    githubClientSecret,
    githubRedirectUri,
    sessionSecret,
    allowedGitHubUsername,
  };
}
