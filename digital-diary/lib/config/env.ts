import "server-only";

export interface EnvConfig {
  githubPat: string;
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
}

export function getEnvConfig(): EnvConfig {
  const githubPat = process.env.GITHUB_PAT;
  const githubOwner = process.env.GITHUB_OWNER;
  const githubRepo = process.env.GITHUB_REPO;
  const githubBranch = process.env.GITHUB_BRANCH || "main";

  if (!githubPat || !githubOwner || !githubRepo) {
    throw new Error("MISSING_REQUIRED_ENV_VARS");
  }

  return {
    githubPat,
    githubOwner,
    githubRepo,
    githubBranch,
  };
}
