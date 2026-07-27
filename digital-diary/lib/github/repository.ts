import { githubFetch } from "./client";

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

export async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const data = await githubFetch<GitHubFile>(`contents/${path}`);
    if (data.type === "file" && data.content) {
      const content = Buffer.from(data.content, data.encoding === "base64" ? "base64" : "utf-8").toString("utf-8");
      return { content, sha: data.sha };
    }
    return null;
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("404")) return null;
    throw e;
  }
}

export async function saveFile(path: string, content: string, sha?: string, message: string = `Update ${path}`): Promise<string> {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
  };
  if (sha) {
    body.sha = sha;
  }

  const response = await githubFetch<{ content: { sha: string } }>(`contents/${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return response.content.sha;
}

export async function saveBinaryFile(path: string, base64Content: string, sha?: string, message: string = `Upload ${path}`): Promise<string> {
  const body: Record<string, string> = {
    message,
    content: base64Content,
  };
  if (sha) body.sha = sha;

  const response = await githubFetch<{ content: { sha: string } }>(`contents/${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return response.content.sha;
}

export async function deleteFile(path: string, sha: string, message: string = `Delete ${path}`): Promise<void> {
  await githubFetch<unknown>(`contents/${path}`, {
    method: "DELETE",
    body: JSON.stringify({
      message,
      sha,
    }),
  });
}
