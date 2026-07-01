import "server-only";

export interface GitHubConfig {
  pat: string;
  owner: string;
  repo: string;
  branch: string;
}

export function getGitHubConfig(): GitHubConfig {
  const pat = process.env.GITHUB_PAT;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!pat || !owner || !repo) {
    throw new Error("MISSING_ENVIRONMENT_VARIABLES");
  }

  return { pat, owner, repo, branch };
}

export async function githubFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const { pat } = getGitHubConfig();

  const url = `https://api.github.com${path}`;
  const headers = {
    Authorization: `Bearer ${pat}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "the-digital-diary",
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
    next: { revalidate: 0 }, // Ensure no cached status checks
  });
}
