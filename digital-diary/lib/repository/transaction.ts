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

/**
 * 4. Restore Transaction
 * Retrieves a memory from trash and moves it back to pages.
 */
export async function restoreMemoryTransaction(slug: string): Promise<void> {
  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();
  const trashPath = `content/trash/${slug}.json`;
  const pagesPath = `content/pages/${slug}.json`;

  // 1. Fetch from trash
  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${trashPath}?ref=${branch}`);
  if (res.status === 404) {
    throw new Error("NOT_IN_TRASH");
  }
  if (!res.ok) {
    throw new Error(`TRASH_FETCH_FAILED: ${res.status}`);
  }

  const data = await res.json();
  const sha = data.sha;
  const contentBase64 = data.content;
  const contentString = Buffer.from(contentBase64, "base64").toString("utf-8");
  const pageData = JSON.parse(contentString);

  // 2. Write to pages
  await writeGitHubFile({
    path: pagesPath,
    content: contentBase64,
    message: `feat: restore memory "${pageData.summary.title}"`,
    contentEncoding: "base64"
  });

  // 3. Delete from trash
  await deleteGitHubFile(trashPath, `feat: remove restored memory from trash`, sha);

  // 4. Add back to index
  const { updateIndexFiles } = await import("@/lib/github/index-writer");
  await updateIndexFiles(pageData.summary);
}

/**
 * 5. Duplicate Transaction
 * Duplicates a memory completely to a new date.
 */
export async function duplicateMemoryTransaction(slug: string, newDate: string): Promise<{ newSlug: string }> {
  // 1. Check date format and conflict
  if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    throw new Error(`INVALID_DATE_FORMAT`);
  }
  const index = await loadMetaIndex();
  const existingConflict = index.find((p) => p.date === newDate);
  if (existingConflict) {
    throw new Error(`DATE_CONFLICT`);
  }

  // 2. Load original memory
  const originalPage = await loadPage(slug);

  // 3. Prepare new memory
  const newSlug = newDate; // Simplest slug format for this diary
  const now = new Date().toISOString();
  const newSession: EditorSession = {
    pageId: `mem-${Date.now()}`,
    title: originalPage.summary.title,
    content: originalPage.blocks,
    date: newDate,
    tags: originalPage.summary.tags,
    favorite: originalPage.summary.favorite || false,
    archived: originalPage.summary.archived || false,
    createdAt: newDate,
    updatedAt: now,
    sha: "", // New file
    isDirty: false,
    mode: "read"
  };

  // 4. Save via normal transaction
  await saveMemoryTransaction(newSession);

  return { newSlug };
}
