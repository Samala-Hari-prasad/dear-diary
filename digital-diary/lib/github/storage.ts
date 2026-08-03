import { getFile, saveFile, deleteFile } from "./repository";

export interface MemoryIndexItem {
  id: string;
  title: string;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
  snippet: string;
  tags?: string[];
  collection?: string;
  entryType?: string;
  favorite?: boolean;
}

import { githubFetch } from "./client";

export async function getIndex(): Promise<{ items: MemoryIndexItem[]; sha?: string }> {
  const file = await getFile("content/index.json");
  if (!file) {
    return { items: [] };
  }
  return { items: JSON.parse(file.content), sha: file.sha };
}

export async function getDiscoveryItems(): Promise<(MemoryIndexItem & { readingTimeMin: number })[]> {
  const { items } = await getIndex();
  
  const sizeMap = new Map<string, number>();
  try {
    const pages = await githubFetch<{ name: string; size: number }[]>("contents/content/pages");
    if (Array.isArray(pages)) {
      pages.forEach(page => {
        const id = page.name.replace(".md", "");
        sizeMap.set(id, page.size);
      });
    }
  } catch (e) {
    console.warn("Failed to fetch pages directory for sizes", e);
  }

  const enhancedItems = items.map(item => {
    const size = sizeMap.get(item.id) || 0;
    // 1 byte ≈ 1 char. ~5 chars per word, ~200 words per minute => ~1000 bytes per minute
    const readingTimeMin = Math.max(1, Math.ceil(size / 1000));
    return {
      ...item,
      readingTimeMin
    };
  });

  return enhancedItems.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
}

export async function saveIndex(items: MemoryIndexItem[], sha?: string): Promise<string> {
  return await saveFile("content/index.json", JSON.stringify(items, null, 2), sha, "Update index.json");
}

export async function getTrashIndex(): Promise<{ items: MemoryIndexItem[]; sha?: string }> {
  const file = await getFile("content/trash-index.json");
  if (!file) {
    return { items: [] };
  }
  return { items: JSON.parse(file.content), sha: file.sha };
}

export async function saveTrashIndex(items: MemoryIndexItem[], sha?: string): Promise<string> {
  return await saveFile("content/trash-index.json", JSON.stringify(items, null, 2), sha, "Update trash-index.json");
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

export async function getAttachmentsList(folder: "images" | "audio" | "pdf"): Promise<{ name: string; url: string; size: number }[]> {
  try {
    const files = await githubFetch<any[]>(`contents/content/attachments/${folder}`);
    if (Array.isArray(files)) {
      return files.map(file => ({
        name: file.name,
        url: `https://raw.githubusercontent.com/Samala-Hari-prasad/dear-diary/main/content/attachments/${folder}/${file.name}`,
        size: file.size
      }));
    }
  } catch (e) {
    console.warn(`Failed to fetch attachments for ${folder}`, e);
  }
  return [];
}
