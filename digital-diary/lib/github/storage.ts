import { getFile, saveFile, deleteFile } from "./repository";

export interface MemoryIndexItem {
  slug: string;
  title: string;
  date: string;
  snippet: string;
  updatedAt: string;
}

export async function getIndex(): Promise<{ items: MemoryIndexItem[]; sha?: string }> {
  const file = await getFile("content/index.json");
  if (!file) {
    return { items: [] };
  }
  return { items: JSON.parse(file.content), sha: file.sha };
}

export async function saveIndex(items: MemoryIndexItem[], sha?: string): Promise<string> {
  return await saveFile("content/index.json", JSON.stringify(items, null, 2), sha, "Update index.json");
}

export async function getPage(slug: string): Promise<{ content: string; sha: string } | null> {
  return await getFile(`content/pages/${slug}.md`);
}

export async function savePage(slug: string, content: string, sha?: string): Promise<string> {
  return await saveFile(`content/pages/${slug}.md`, content, sha, `Save page ${slug}`);
}

export async function getTrashPage(slug: string): Promise<{ content: string; sha: string } | null> {
  return await getFile(`content/trash/${slug}.md`);
}

export async function saveTrashPage(slug: string, content: string, sha?: string): Promise<string> {
  return await saveFile(`content/trash/${slug}.md`, content, sha, `Move page ${slug} to trash`);
}

export async function deletePageFile(slug: string, sha: string): Promise<void> {
  await deleteFile(`content/pages/${slug}.md`, sha, `Delete page ${slug}`);
}

export async function deleteTrashPageFile(slug: string, sha: string): Promise<void> {
  await deleteFile(`content/trash/${slug}.md`, sha, `Permanently delete ${slug}`);
}
