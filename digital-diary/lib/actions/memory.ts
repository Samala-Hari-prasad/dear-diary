"use server";

import { getIndex, saveIndex, getPage, savePage, saveTrashPage, deletePageFile, getTrashPage, deleteTrashPageFile } from "@/lib/github/storage";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function createMemory(rawSlug: string, title: string, content: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const slug = rawSlug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (!slug) throw new Error("Invalid slug");

  const date = new Date().toISOString();
  const snippet = content.slice(0, 100).replace(/\n/g, " ");

  const { items, sha } = await getIndex();
  
  const existingIndex = items.findIndex((i) => i.slug === slug);
  if (existingIndex >= 0) {
    items[existingIndex] = { ...items[existingIndex], title, snippet, updatedAt: date };
  } else {
    items.unshift({ slug, title, date, snippet, updatedAt: date });
  }

  const existingPage = await getPage(slug);
  await savePage(slug, content, existingPage?.sha);
  await saveIndex(items, sha);
  
  revalidatePath("/");
  return { success: true };
}

export async function updateMemory(slug: string, title: string, content: string) {
  return createMemory(slug, title, content);
}

export async function deleteMemory(slug: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const page = await getPage(slug);
  if (!page) throw new Error("Not found");

  const { items, sha } = await getIndex();
  
  await saveTrashPage(slug, page.content);
  await deletePageFile(slug, page.sha);

  const newItems = items.filter((i) => i.slug !== slug);
  await saveIndex(newItems, sha);

  revalidatePath("/");
  return { success: true };
}

export async function restoreMemory(slug: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const trashPage = await getTrashPage(slug);
  if (!trashPage) throw new Error("Not found in trash");

  await savePage(slug, trashPage.content);
  await deleteTrashPageFile(slug, trashPage.sha);

  const { items, sha } = await getIndex();
  
  const lines = trashPage.content.split("\n");
  const title = lines.find(l => l.startsWith("# "))?.replace("# ", "") || slug;
  const snippet = trashPage.content.slice(0, 100).replace(/\n/g, " ");
  
  items.unshift({
    slug,
    title,
    snippet,
    date: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  await saveIndex(items, sha);

  revalidatePath("/");
  return { success: true };
}
