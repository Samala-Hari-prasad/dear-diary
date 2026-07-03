// server-only import ensures this runs only on server
import "server-only";
import { getEnvConfig } from "@/lib/config/env";
import { githubFetch } from "./client";

// Expanded error codes for clearer diagnostics
export enum RepositoryErrorCode {
  INVALID_CONFIGURATION = "INVALID_CONFIGURATION",
  TOKEN_INVALID = "TOKEN_INVALID",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  REPOSITORY_NOT_FOUND = "REPOSITORY_NOT_FOUND",
  BRANCH_NOT_FOUND = "BRANCH_NOT_FOUND",
  MANIFEST_NOT_FOUND = "MANIFEST_NOT_FOUND",
  MANIFEST_INVALID = "MANIFEST_INVALID",
  RATE_LIMITED = "RATE_LIMITED",
  GITHUB_UNAVAILABLE = "GITHUB_UNAVAILABLE",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
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

/**
 * Returns a human‑readable message for a given RepositoryErrorCode.
 */
function getMessageForCode(code: RepositoryErrorCode): string {
  switch (code) {
    case RepositoryErrorCode.INVALID_CONFIGURATION:
      return "Required GitHub environment variables are missing or misconfigured.";
    case RepositoryErrorCode.TOKEN_INVALID:
      return "GitHub Personal Access Token is invalid or has expired.";
    case RepositoryErrorCode.INSUFFICIENT_PERMISSIONS:
      return "GitHub token does not have sufficient permissions for the repository.";
    case RepositoryErrorCode.REPOSITORY_NOT_FOUND:
      return "The specified repository could not be found or the token lacks access.";
    case RepositoryErrorCode.BRANCH_NOT_FOUND:
      return "The specified branch does not exist in the repository.";
    case RepositoryErrorCode.MANIFEST_NOT_FOUND:
      return "The repository is accessible, but 'manifest.json' is missing from the root directory.";
    case RepositoryErrorCode.MANIFEST_INVALID:
      return "'manifest.json' is invalid or malformed.";
    case RepositoryErrorCode.RATE_LIMITED:
      return "GitHub API rate limit exceeded. Please try again later.";
    case RepositoryErrorCode.GITHUB_UNAVAILABLE:
      return "GitHub is currently unavailable (5xx server error).";
    case RepositoryErrorCode.NETWORK_ERROR:
      return "Network error trying to connect to the GitHub API.";
    case RepositoryErrorCode.UNKNOWN_ERROR:
      return "An unknown error occurred while checking repository health.";
    case RepositoryErrorCode.UNEXPECTED_ERROR:
      return "An unexpected error occurred during connection health check.";
    default:
      return "An error occurred.";
  }
}

/** Helper to push a diagnostic with a generated message */
function pushDiagnostic(
  diagnostics: Diagnostic[],
  code: RepositoryErrorCode,
  severity: "error" | "warning" = "error"
) {
  diagnostics.push({ code, severity, message: getMessageForCode(code) });
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
      pushDiagnostic(diagnostics, RepositoryErrorCode.INVALID_CONFIGURATION);
      return { healthy: false, version, timestamp, diagnostics };
    }

    const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = config;

    // 2. Fetch repository info
    let repoRes;
    try {
      repoRes = await githubFetch(`/repos/${owner}/${repo}`);
    } catch {
      pushDiagnostic(diagnostics, RepositoryErrorCode.NETWORK_ERROR);
      return { healthy: false, version, timestamp, diagnostics };
    }

    // Map HTTP status to diagnostics
    if (!repoRes.ok) {
      if (repoRes.status === 401) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.TOKEN_INVALID);
      } else if (repoRes.status === 403) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.INSUFFICIENT_PERMISSIONS);
      } else if (repoRes.status === 404) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.REPOSITORY_NOT_FOUND);
      } else if (repoRes.status === 429) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.RATE_LIMITED);
      } else if (repoRes.status >= 500 && repoRes.status <= 599) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.GITHUB_UNAVAILABLE);
      } else {
        pushDiagnostic(diagnostics, RepositoryErrorCode.UNKNOWN_ERROR);
      }
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
    if (!branchRes.ok) {
      if (branchRes.status === 404) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.BRANCH_NOT_FOUND);
      } else if (branchRes.status === 429) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.RATE_LIMITED);
      } else if (branchRes.status >= 500 && branchRes.status <= 599) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.GITHUB_UNAVAILABLE);
      } else {
        pushDiagnostic(diagnostics, RepositoryErrorCode.UNKNOWN_ERROR);
      }
      return { healthy: false, version, timestamp, repository: repositoryInfo, diagnostics };
    }

    // 4. Fetch manifest.json
    const manifestRes = await githubFetch(`/repos/${owner}/${repo}/contents/manifest.json?ref=${branch}`);
    if (!manifestRes.ok) {
      if (manifestRes.status === 404) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.MANIFEST_NOT_FOUND);
      } else if (manifestRes.status === 429) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.RATE_LIMITED);
      } else if (manifestRes.status >= 500 && manifestRes.status <= 599) {
        pushDiagnostic(diagnostics, RepositoryErrorCode.GITHUB_UNAVAILABLE);
      } else {
        pushDiagnostic(diagnostics, RepositoryErrorCode.UNKNOWN_ERROR);
      }
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
      pushDiagnostic(diagnostics, RepositoryErrorCode.MANIFEST_INVALID);
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        manifest: { found: false },
        diagnostics,
      };
    }

    // Decode Base64 content
    let rawContent: string;
    try {
      rawContent = Buffer.from(manifestMetadata.content, "base64").toString("utf-8");
    } catch {
      pushDiagnostic(diagnostics, RepositoryErrorCode.MANIFEST_INVALID);
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
      pushDiagnostic(diagnostics, RepositoryErrorCode.MANIFEST_INVALID);
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        manifest: { found: false },
        diagnostics,
      };
    }

    const {
      schemaVersion,
      appVersion,
      owner: manifestOwner,
      createdAt,
      application,
      theme,
      language,
    } = manifestData;

    if (
      typeof schemaVersion !== "number" ||
      typeof appVersion !== "string" ||
      typeof manifestOwner !== "string" ||
      typeof createdAt !== "string" ||
      typeof application !== "string" ||
      typeof theme !== "string" ||
      typeof language !== "string"
    ) {
      pushDiagnostic(diagnostics, RepositoryErrorCode.MANIFEST_INVALID);
      return {
        healthy: false,
        version,
        timestamp,
        repository: repositoryInfo,
        manifest: { found: true },
        diagnostics,
      };
    }

    // All checks passed – healthy
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
    return { healthy: false, version, timestamp, diagnostics };
  }
}
