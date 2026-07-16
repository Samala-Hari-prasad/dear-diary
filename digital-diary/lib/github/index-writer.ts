import "server-only";
import { getEnvConfig } from "@/lib/config/env";
import { githubFetch } from "./client";
import { writeGitHubFile } from "./write";
import { DiaryPageSummary } from "@/types/models/diary-summary";

export async function updateIndexFiles(
  updatedSummary: DiaryPageSummary
): Promise<void> {
  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();

  const indexPath = "content/index/meta-index.json";
  
  // 1. Fetch current meta-index.json and its SHA
  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${indexPath}?ref=${branch}`);

  let currentPages: DiaryPageSummary[] = [];
  let indexSha: string | undefined = undefined;

  if (res.status === 200) {
    const data = await res.json();
    indexSha = data.sha;
    if (data.content) {
      const rawContent = Buffer.from(data.content, "base64").toString("utf-8");
      try {
        const parsed = JSON.parse(rawContent);
        if (parsed && Array.isArray(parsed.pages)) {
          currentPages = parsed.pages;
        }
      } catch {
        // Fallback to empty if parse fails
      }
    }
  } else if (res.status !== 404) {
    throw new Error(`INDEX_FETCH_FAILED: ${res.status}`);
  }

  // 2. Insert or update entry
  const exists = currentPages.some((p) => p.id === updatedSummary.id);
  let newPages: DiaryPageSummary[] = [];

  if (exists) {
    newPages = currentPages.map((p) =>
      p.id === updatedSummary.id ? updatedSummary : p
    );
  } else {
    newPages = [updatedSummary, ...currentPages];
  }

  // 3. Write updated index back to GitHub
  const contentToSave = JSON.stringify({ pages: newPages }, null, 2);
  await writeGitHubFile({
    path: indexPath,
    content: contentToSave,
    message: `chore: update meta-index for "${updatedSummary.title}"`,
    sha: indexSha,
  });
}

export async function deleteFromIndexFiles(slug: string): Promise<void> {
  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();
  const indexPath = "content/index/meta-index.json";
  
  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${indexPath}?ref=${branch}`);
  if (res.status === 404) return;

  if (res.status !== 200) {
    throw new Error(`INDEX_FETCH_FAILED: ${res.status}`);
  }

  const data = await res.json();
  const indexSha = data.sha;
  if (!data.content) return;

  const rawContent = Buffer.from(data.content, "base64").toString("utf-8");
  let currentPages: DiaryPageSummary[] = [];
  try {
    const parsed = JSON.parse(rawContent);
    if (parsed && Array.isArray(parsed.pages)) {
      currentPages = parsed.pages;
    }
  } catch {
    return;
  }

  const newPages = currentPages.filter((p) => p.slug !== slug);
  if (newPages.length === currentPages.length) return; // Not found in index

  const contentToSave = JSON.stringify({ pages: newPages }, null, 2);
  await writeGitHubFile({
    path: indexPath,
    content: contentToSave,
    message: `chore: remove meta-index entry for "${slug}"`,
    sha: indexSha,
  });
}
