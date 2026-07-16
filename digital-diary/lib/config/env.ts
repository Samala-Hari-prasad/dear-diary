import "server-only";

export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export interface EnvConfig {
  githubToken: string;
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
}

export function getEnvConfig(): EnvConfig {
  const githubToken = getRequiredEnv("GITHUB_TOKEN");
  const githubOwner = getRequiredEnv("GITHUB_OWNER");
  const githubRepo = getRequiredEnv("GITHUB_REPO");
  const githubBranch = process.env.GITHUB_BRANCH ?? "main";

  return {
    githubToken,
    githubOwner,
    githubRepo,
    githubBranch,
  };
}
