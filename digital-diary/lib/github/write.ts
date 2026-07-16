import "server-only";
import { getEnvConfig } from "@/lib/config/env";
import { githubFetch } from "./client";

interface WriteFileParams {
  path: string;
  content: string;
  message: string;
  sha?: string;
  contentEncoding?: "utf-8" | "base64";
}

export async function writeGitHubFile({
  path,
  content,
  message,
  sha,
  contentEncoding = "utf-8",
}: WriteFileParams): Promise<{ sha: string }> {
  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();

  const base64Content =
    contentEncoding === "base64"
      ? content
      : Buffer.from(content, "utf-8").toString("base64");

  const body: Record<string, any> = {
    message,
    content: base64Content,
    branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (res.status === 409) {
    throw new Error("CONFLICT");
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      `WRITE_FAILED: ${res.status} - ${errorBody.message || "Unknown error"}`
    );
  }

  const data = await res.json();
  return {
    sha: data.content?.sha || "",
  };
}

export async function deleteGitHubFile(
  path: string,
  message: string,
  sha: string
): Promise<void> {
  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();

  const body = {
    message,
    sha,
    branch,
  };

  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${path}`, {
    method: "DELETE",
    body: JSON.stringify(body),
  });

  if (res.status === 404) {
    // Already deleted
    return;
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      `DELETE_FAILED: ${res.status} - ${errorBody.message || "Unknown error"}`
    );
  }
}
