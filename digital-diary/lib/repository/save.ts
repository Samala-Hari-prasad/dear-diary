import "server-only";
import { EditorSession } from "@/types/models/editor-document";
import { DiaryPage } from "@/types/models/diary-page";
import { writeGitHubFile } from "@/lib/github/write";
import { updateIndexFiles } from "@/lib/github/index-writer";
import { loadMetaIndex } from "@/lib/github/index";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return base || "untitled-memory-" + Date.now();
}

export async function saveEditorSession(
  session: EditorSession
): Promise<{ sha: string; slug: string; updatedAt: string }> {
  // Validate date format if present
  if (session.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(session.date)) {
      throw new Error(`INVALID_DATE_FORMAT`);
    }
    
    // Check for "One Memory Per Day" conflict
    const currentIndex = await loadMetaIndex();
    const existingConflict = currentIndex.find(
      (p) => (p.date === session.date || (!p.date && p.updatedAt.startsWith(session.date!))) && p.id !== session.pageId
    );
    if (existingConflict) {
      throw new Error(`DATE_CONFLICT`);
    }
  }

  // Generate a clean slug for new drafts, otherwise preserve existing exactly. Slug never changes after creation.
  let slug = session.pageId || "";
  if (!slug || slug.startsWith("draft-") || slug.startsWith("new-memory-")) {
    slug = generateSlug(session.title);
  }

  const path = `content/pages/${slug}.json`;
  const updatedAt = new Date().toISOString();

  // Map session to DiaryPage storage format
  const diaryPage: DiaryPage = {
    summary: {
      id: slug,
      slug: slug,
      title: session.title || "Untitled Memory",
      cover: null, // Cover image management belongs to v0.7.0 Media Workspace
      date: session.date,
      updatedAt,
      tags: session.tags,
      favorite: session.favorite,
      archived: session.archived,
    },
    blocks: session.content,
  };

  const fileContent = JSON.stringify(diaryPage, null, 2);

  // 1. Write page file to GitHub
  const { sha: newSha } = await writeGitHubFile({
    path,
    content: fileContent,
    message: `feat: write memory "${diaryPage.summary.title}"`,
    sha: session.sha,
  });

  // 2. Update the meta-index.json mapping
  await updateIndexFiles(diaryPage.summary);

  return {
    sha: newSha,
    slug,
    updatedAt,
  };
}
