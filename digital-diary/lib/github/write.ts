import "server-only";
import { getEnvConfig } from "@/lib/config/env";
import { githubFetch } from "./client";

interface WriteFileParams {
  path: string;
  content: string; // Plain string content, we base64 encode it in this function
  message: string;
  sha?: string;
}

export async function writeGitHubFile({
  path,
  content,
  message,
  sha,
}: WriteFileParams): Promise<{ sha: string }> {
  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();

  const base64Content = Buffer.from(content, "utf-8").toString("base64");

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
