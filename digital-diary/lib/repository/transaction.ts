import "server-only";
import { EditorSession } from "@/types/models/editor-document";
import { saveEditorSession } from "./save";
import { deleteGitHubFile, writeGitHubFile } from "@/lib/github/write";
import { deleteFromIndexFiles } from "@/lib/github/index-writer";
import { loadMetaIndex } from "@/lib/github/index";
import { getEnvConfig } from "@/lib/config/env";
import { githubFetch } from "@/lib/github/client";
import { loadPage } from "@/lib/github/page";

/**
 * 1. Save Transaction
 * Coordinates writing the page file and updating the meta-index.
 */
export async function saveMemoryTransaction(session: EditorSession) {
  return await saveEditorSession(session);
}

/**
 * 2. Delete Transaction
 * Coordinates deleting the page file and removing the entry from the meta-index.
 */
export async function deleteMemoryTransaction(slug: string): Promise<void> {
  const index = await loadMetaIndex();
  const existing = index.find((p) => p.slug === slug);
  
  if (!existing) {
    throw new Error("MEMORY_NOT_FOUND");
  }

  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();
  const path = `content/pages/${slug}.json`;
  
  // Need the SHA of the page to delete it
  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
  if (res.status === 404) {
    // Already deleted from files, just remove from index
    await deleteFromIndexFiles(slug);
    return;
  }

  if (!res.ok) {
    throw new Error(`PAGE_FETCH_FAILED: ${res.status}`);
  }

  const data = await res.json();
  const sha = data.sha;
  const content = data.content;

  // 1. Write to trash
  try {
    await writeGitHubFile({
      path: `content/trash/${slug}.json`,
      content,
      message: `feat: move memory "${existing.title}" to trash`,
      contentEncoding: "base64"
    });
  } catch (err: any) {
    if (!err.message.includes("CONFLICT")) {
      throw err; // Ignore if already in trash
    }
  }

  // 2. Delete the page file
  await deleteGitHubFile(path, `feat: delete memory "${existing.title}"`, sha);

  // 3. Update the meta-index
  await deleteFromIndexFiles(slug);
}

/**
 * 3. Change Date Transaction
 * Validates constraints, loads the memory, updates its date, and saves it.
 */
export async function changeDateTransaction(slug: string, newDate: string): Promise<void> {
  // 1. Verify date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    throw new Error(`INVALID_DATE_FORMAT`);
  }

  // 2. Check for conflict
  const index = await loadMetaIndex();
  const existingConflict = index.find((p) => p.date === newDate && p.slug !== slug);
  if (existingConflict) {
    throw new Error(`DATE_CONFLICT`);
  }

  // 3. Load the full page to update it
  const page = await loadPage(slug);
  
  // 4. Update the date and save it via saveMemoryTransaction
  const session: EditorSession = {
    pageId: page.summary.id,
    title: page.summary.title,
    content: page.blocks,
    date: newDate,
    tags: page.summary.tags,
    favorite: page.summary.favorite || false,
    archived: page.summary.archived || false,
    updatedAt: page.summary.updatedAt,
    sha: page.sha,
    isDirty: false,
    mode: "read",
    createdAt: page.summary.date || page.summary.updatedAt
  };

  await saveMemoryTransaction(session);
}
