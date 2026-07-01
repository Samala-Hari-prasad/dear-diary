import "server-only";
import { getEnvConfig } from "@/lib/config/env";
import { githubFetch } from "./client";

export enum RepositoryErrorCode {
  INVALID_CONFIGURATION = "INVALID_CONFIGURATION",
  TOKEN_INVALID = "TOKEN_INVALID",
  REPOSITORY_NOT_FOUND = "REPOSITORY_NOT_FOUND",
  BRANCH_NOT_FOUND = "BRANCH_NOT_FOUND",
  MANIFEST_NOT_FOUND = "MANIFEST_NOT_FOUND",
  MANIFEST_INVALID = "MANIFEST_INVALID",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
}

export interface Diagnostic {
  code: RepositoryErrorCode;
  severity: "error" | "warning";
  message: string;
}

export interface RepositoryHealth {
  healthy: boolean;
  version: string;
  timestamp: string;
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
    application?: string;
    theme?: string;
    language?: string;
  };
  diagnostics: Diagnostic[];
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
  application?: unknown;
  theme?: unknown;
  language?: unknown;
}

export async function checkSystemStatus(): Promise<RepositoryHealth> {
  const timestamp = new Date().toISOString();
  const version = "1.0.0"; // App Version
  const diagnostics: Diagnostic[] = [];

  try {
    // 1. Env validation
    let config;
    try {
      config = getEnvConfig();
    } catch {
      diagnostics.push({
        code: RepositoryErrorCode.INVALID_CONFIGURATION,
        severity: "error",
        message: "Required GitHub environment variables are missing or misconfigured.",
      });
      return { healthy: false, version, timestamp, diagnostics };
    }

    const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = config;

    // 2. Fetch repository info
    let repoRes;
    try {
      repoRes = await githubFetch(`/repos/${owner}/${repo}`);
    } catch {
      diagnostics.push({
        code: RepositoryErrorCode.NETWORK_ERROR,
        severity: "error",
        message: "Network error trying to connect to the GitHub API.",
      });
      return { healthy: false, version, timestamp, diagnostics };
    }

    if (repoRes.status === 401 || repoRes.status === 403) {
      diagnostics.push({
        code: RepositoryErrorCode.TOKEN_INVALID,
        severity: "error",
        message: "GitHub Personal Access Token is invalid or has expired.",
      });
      return { healthy: false, version, timestamp, diagnostics };
    }
    if (repoRes.status === 404) {
      diagnostics.push({
        code: RepositoryErrorCode.REPOSITORY_NOT_FOUND,
        severity: "error",
        message: `Repository '${owner}/${repo}' could not be found. Make sure the PAT has access.`,
      });
      return { healthy: false, version, timestamp, diagnostics };
    }
    if (!repoRes.ok) {
      diagnostics.push({
        code: RepositoryErrorCode.NETWORK_ERROR,
        severity: "error",
        message: "Failed to fetch repository metadata from GitHub.",
      });
      return { healthy: false, version, timestamp, diagnostics };
    }

    const repoData: GitHubRepoResponse = await repoRes.json();
    const repositoryInfo = {
      owner: repoData.owner.login,
      name: repoData.name,
      branch,
      private: repoData.private,
    };

    // 3. Fetch branch info
    const branchRes = await githubFetch(`/repos/${owner}/${repo}/branches/${branch}`);
    if (branchRes.status === 404) {
      diagnostics.push({
        code: RepositoryErrorCode.BRANCH_NOT_FOUND,
        severity: "error",
        message: `Branch '${branch}' does not exist in the repository.`,
      });
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        diagnostics,
      };
    }
    if (!branchRes.ok) {
      diagnostics.push({
        code: RepositoryErrorCode.NETWORK_ERROR,
        severity: "error",
        message: "Failed to verify the existence of the branch.",
      });
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        diagnostics,
      };
    }

    // 4. Fetch manifest.json
    const manifestRes = await githubFetch(`/repos/${owner}/${repo}/contents/manifest.json?ref=${branch}`);
    if (manifestRes.status === 404) {
      diagnostics.push({
        code: RepositoryErrorCode.MANIFEST_NOT_FOUND,
        severity: "error",
        message: "The repository is accessible, but 'manifest.json' is missing from the root directory.",
      });
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        manifest: { found: false },
        diagnostics,
      };
    }
    if (!manifestRes.ok) {
      diagnostics.push({
        code: RepositoryErrorCode.NETWORK_ERROR,
        severity: "error",
        message: "Failed to retrieve 'manifest.json' from GitHub.",
      });
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        manifest: { found: false },
        diagnostics,
      };
    }

    const manifestMetadata = await manifestRes.json();
    if (!manifestMetadata.content) {
      diagnostics.push({
        code: RepositoryErrorCode.MANIFEST_INVALID,
        severity: "error",
        message: "'manifest.json' has no content.",
      });
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        manifest: { found: false },
        diagnostics,
      };
    }

    // Base64 decode content
    let rawContent: string;
    try {
      rawContent = Buffer.from(manifestMetadata.content, "base64").toString("utf-8");
    } catch {
      diagnostics.push({
        code: RepositoryErrorCode.MANIFEST_INVALID,
        severity: "error",
        message: "Failed to decode the Base64 content of 'manifest.json'.",
      });
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        manifest: { found: false },
        diagnostics,
      };
    }

    let manifestData: ManifestData;
    try {
      manifestData = JSON.parse(rawContent);
    } catch {
      diagnostics.push({
        code: RepositoryErrorCode.MANIFEST_INVALID,
        severity: "error",
        message: "'manifest.json' contains malformed JSON.",
      });
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        manifest: { found: false },
        diagnostics,
      };
    }

    // 5. Schema Validation
    const { schemaVersion, appVersion, owner: manifestOwner, createdAt, application, theme, language } = manifestData;

    if (
      typeof schemaVersion !== "number" ||
      typeof appVersion !== "string" ||
      typeof manifestOwner !== "string" ||
      typeof createdAt !== "string" ||
      typeof application !== "string" ||
      typeof theme !== "string" ||
      typeof language !== "string"
    ) {
      diagnostics.push({
        code: RepositoryErrorCode.MANIFEST_INVALID,
        severity: "error",
        message: "'manifest.json' is missing required fields (schemaVersion, appVersion, owner, createdAt, application, theme, language) or has an invalid schema.",
      });
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        manifest: { found: true },
        diagnostics,
      };
    }

    // Everything is fully checked and parsed
    return {
      healthy: true,
      version,
      timestamp,
      repository: repositoryInfo,
      manifest: {
        found: true,
        schemaVersion,
        appVersion,
        owner: manifestOwner,
        createdAt,
        application,
        theme,
        language,
      },
      diagnostics,
    };
  } catch (error: any) {
    diagnostics.push({
      code: RepositoryErrorCode.UNEXPECTED_ERROR,
      severity: "error",
      message: error.message || "An unexpected error occurred during connection health check.",
    });
    return {
      healthy: false,
      version,
      timestamp,
      diagnostics,
    };
  }
}
