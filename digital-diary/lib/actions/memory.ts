"use server";

import { getIndex, saveIndex, getPage, savePage, saveTrashPage, deletePageFile, getTrashPage, deleteTrashPageFile, getTrashIndex, saveTrashIndex } from "@/lib/github/storage";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import matter from "gray-matter";

export async function createMemory(id: string, title: string, content: string, eventDate: string, createdAt: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  if (!id) throw new Error("Invalid id");

  const updatedAt = new Date().toISOString();
  // Strip frontmatter from content snippet just in case
  const parsed = matter(content);
  const bodyText = parsed.content || content;
  const snippet = bodyText.slice(0, 100).replace(/\n/g, " ");

  const { items, sha } = await getIndex();
  
  const existingIndex = items.findIndex((i) => i.id === id);
  if (existingIndex >= 0) {
    throw new Error("Entry already exists");
  } else {
    items.unshift({ id, title, eventDate, createdAt, updatedAt, snippet, entryType: "journal" });
  }

  // Prepend frontmatter to the raw content
  const contentWithFrontmatter = matter.stringify(bodyText, {
    id,
    title,
    eventDate,
    createdAt,
    updatedAt,
    entryType: "journal"
  });

  await savePage(id, contentWithFrontmatter);
  await saveIndex(items, sha);
  
  revalidatePath("/");
  return { success: true };
}

export async function updateMemory(id: string, title: string, content: string, eventDate: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const existingPage = await getPage(id);
  if (!existingPage) throw new Error("Entry not found");

  const parsed = matter(existingPage.content);
  const createdAt = parsed.data.createdAt || new Date().toISOString();
  const updatedAt = new Date().toISOString();
  
  // The content from editor doesn't have frontmatter
  const bodyText = content;
  const snippet = bodyText.slice(0, 100).replace(/\n/g, " ");

  const contentWithFrontmatter = matter.stringify(bodyText, {
    ...parsed.data, // preserve other tags/collections
    id,
    title,
    eventDate,
    createdAt,
    updatedAt,
    entryType: "journal"
  });

  const { items, sha } = await getIndex();
  
  const existingIndex = items.findIndex((i) => i.id === id);
  if (existingIndex >= 0) {
    items[existingIndex] = { ...items[existingIndex], title, eventDate, updatedAt, snippet };
  } else {
    items.unshift({ id, title, eventDate, createdAt, updatedAt, snippet, entryType: "journal" });
  }

  await savePage(id, contentWithFrontmatter, existingPage.sha);
  await saveIndex(items, sha);
  
  revalidatePath("/");
  return { success: true };
}

export async function deleteMemory(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const page = await getPage(id);
  if (!page) throw new Error("Not found");

  const { items, sha: indexSha } = await getIndex();
  const deletedItem = items.find((i) => i.id === id);
  if (!deletedItem) throw new Error("Not found in index");
  
  await saveTrashPage(id, page.content);
  await deletePageFile(id, page.sha);

  const newItems = items.filter((i) => i.id !== id);
  await saveIndex(newItems, indexSha);

  const { items: trashItems, sha: trashSha } = await getTrashIndex();
  trashItems.unshift(deletedItem);
  await saveTrashIndex(trashItems, trashSha);

  revalidatePath("/");
  return { success: true };
}

export async function restoreMemory(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const trashPage = await getTrashPage(id);
  if (!trashPage) throw new Error("Not found in trash");

  await savePage(id, trashPage.content);
  await deleteTrashPageFile(id, trashPage.sha);

  const { items: trashItems, sha: trashSha } = await getTrashIndex();
  const restoredItem = trashItems.find((i) => i.id === id);
  const newTrashItems = trashItems.filter((i) => i.id !== id);
  await saveTrashIndex(newTrashItems, trashSha);

  const { items, sha: indexSha } = await getIndex();
  
  if (restoredItem) {
    items.unshift(restoredItem);
  } else {
    const parsed = matter(trashPage.content);
    items.unshift({
      id,
      title: parsed.data.title || "Untitled",
      snippet: parsed.content.slice(0, 100).replace(/\n/g, " "),
      eventDate: parsed.data.eventDate || new Date().toISOString().split('T')[0],
      createdAt: parsed.data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      entryType: parsed.data.entryType || "journal"
    });
  }

  await saveIndex(items, indexSha);

  revalidatePath("/");
  return { success: true };
}

export async function permanentDeleteMemory(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const trashPage = await getTrashPage(id);
  if (trashPage) {
    await deleteTrashPageFile(id, trashPage.sha);
  }

  const { items, sha } = await getTrashIndex();
  const newItems = items.filter(i => i.id !== id);
  await saveTrashIndex(newItems, sha);

  revalidatePath("/");
  return { success: true };
}

export async function emptyTrash() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const { items, sha } = await getTrashIndex();
  
  for (const item of items) {
    const page = await getTrashPage(item.id);
    if (page) {
      await deleteTrashPageFile(item.id, page.sha);
    }
  }

  await saveTrashIndex([], sha);
  revalidatePath("/");
  return { success: true };
}

export async function checkExistingEntry(eventDate: string): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  const { items } = await getIndex();
  const existing = items.find(i => i.eventDate === eventDate);
  
  return existing ? existing.id : null;
}
