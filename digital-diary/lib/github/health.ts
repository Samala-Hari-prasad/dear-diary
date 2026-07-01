import "server-only";
import { getGitHubConfig, githubFetch } from "./client";

export interface SystemStatus {
  healthy: boolean;
  repository?: {
    owner: string;
    name: string;
    branch: string;
    private: boolean;
  };
  manifest?: {
    found: boolean;
    schemaVersion?: number;
    appVersion?: string;
    owner?: string;
    createdAt?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

interface GitHubRepoResponse {
  private: boolean;
  name: string;
  owner: {
    login: string;
  };
}

interface ManifestData {
  schemaVersion?: unknown;
  appVersion?: unknown;
  owner?: unknown;
  createdAt?: unknown;
}

export async function checkSystemStatus(): Promise<SystemStatus> {
  try {
    // 1. Env validation
    let config;
    try {
      config = getGitHubConfig();
    } catch (e: any) {
      return {
        healthy: false,
        error: {
          code: "ENV_CONFIG_ERROR",
          message: "Required GitHub environment variables are missing or misconfigured.",
        },
      };
    }

    const { owner, repo, branch } = config;

    // 2. Fetch repository info
    const repoRes = await githubFetch(`/repos/${owner}/${repo}`);
    if (repoRes.status === 401 || repoRes.status === 403) {
      return {
        healthy: false,
        error: {
          code: "AUTHENTICATION_FAILED",
          message: "GitHub Personal Access Token is invalid or has expired.",
        },
      };
    }
    if (repoRes.status === 404) {
      return {
        healthy: false,
        error: {
          code: "REPOSITORY_NOT_FOUND",
          message: `Repository '${owner}/${repo}' could not be found. Make sure the PAT has access.`,
        },
      };
    }
    if (!repoRes.ok) {
      return {
        healthy: false,
        error: {
          code: "GITHUB_API_ERROR",
          message: "Failed to fetch repository metadata from GitHub.",
        },
      };
    }

    const repoData: GitHubRepoResponse = await repoRes.json();

    // 3. Fetch branch info
    const branchRes = await githubFetch(`/repos/${owner}/${repo}/branches/${branch}`);
    if (branchRes.status === 404) {
      return {
        healthy: false,
        repository: {
          owner: repoData.owner.login,
          name: repoData.name,
          branch,
          private: repoData.private,
        },
        error: {
          code: "BRANCH_NOT_FOUND",
          message: `Branch '${branch}' does not exist in the repository.`,
        },
      };
    }
    if (!branchRes.ok) {
      return {
        healthy: false,
        repository: {
          owner: repoData.owner.login,
          name: repoData.name,
          branch,
          private: repoData.private,
        },
        error: {
          code: "BRANCH_CHECK_FAILED",
          message: "Failed to verify the existence of the branch.",
        },
      };
    }

    // 4. Fetch manifest.json
    const manifestRes = await githubFetch(`/repos/${owner}/${repo}/contents/manifest.json?ref=${branch}`);
    if (manifestRes.status === 404) {
      return {
        healthy: false,
        repository: {
          owner: repoData.owner.login,
          name: repoData.name,
          branch,
          private: repoData.private,
        },
        manifest: {
          found: false,
        },
        error: {
          code: "MANIFEST_NOT_FOUND",
          message: "The repository is accessible, but 'manifest.json' is missing from the root directory.",
        },
      };
    }
    if (!manifestRes.ok) {
      return {
        healthy: false,
        repository: {
          owner: repoData.owner.login,
          name: repoData.name,
          branch,
          private: repoData.private,
        },
        manifest: {
          found: false,
        },
        error: {
          code: "MANIFEST_LOAD_FAILED",
          message: "Failed to retrieve 'manifest.json' from GitHub.",
        },
      };
    }

    const manifestMetadata = await manifestRes.json();
    if (!manifestMetadata.content) {
      return {
        healthy: false,
        repository: {
          owner: repoData.owner.login,
          name: repoData.name,
          branch,
          private: repoData.private,
        },
        manifest: {
          found: false,
        },
        error: {
          code: "MANIFEST_EMPTY",
          message: "'manifest.json' has no content.",
        },
      };
    }

    // Base64 decode content
    let rawContent: string;
    try {
      rawContent = Buffer.from(manifestMetadata.content, "base64").toString("utf-8");
    } catch {
      return {
        healthy: false,
        repository: {
          owner: repoData.owner.login,
          name: repoData.name,
          branch,
          private: repoData.private,
        },
        manifest: {
          found: false,
        },
        error: {
          code: "MANIFEST_DECODE_FAILED",
          message: "Failed to decode the Base64 content of 'manifest.json'.",
        },
      };
    }

    let manifestData: ManifestData;
    try {
      manifestData = JSON.parse(rawContent);
    } catch {
      return {
        healthy: false,
        repository: {
          owner: repoData.owner.login,
          name: repoData.name,
          branch,
          private: repoData.private,
        },
        manifest: {
          found: false,
        },
        error: {
          code: "MANIFEST_PARSE_FAILED",
          message: "'manifest.json' contains malformed JSON.",
        },
      };
    }

    // 5. Schema Validation
    const { schemaVersion, appVersion, owner: manifestOwner, createdAt } = manifestData;

    if (
      typeof schemaVersion !== "number" ||
      typeof appVersion !== "string" ||
      typeof manifestOwner !== "string" ||
      typeof createdAt !== "string"
    ) {
      return {
        healthy: false,
        repository: {
          owner: repoData.owner.login,
          name: repoData.name,
          branch,
          private: repoData.private,
        },
        manifest: {
          found: true,
        },
        error: {
          code: "MANIFEST_SCHEMA_INVALID",
          message: "'manifest.json' is missing required fields or has an invalid schema.",
        },
      };
    }

    return {
      healthy: true,
      repository: {
        owner: repoData.owner.login,
        name: repoData.name,
        branch,
        private: repoData.private,
      },
      manifest: {
        found: true,
        schemaVersion,
        appVersion,
        owner: manifestOwner,
        createdAt,
      },
    };
  } catch (error: any) {
    return {
      healthy: false,
      error: {
        code: "UNEXPECTED_SYSTEM_ERROR",
        message: error.message || "An unexpected error occurred during connection health check.",
      },
    };
  }
}
