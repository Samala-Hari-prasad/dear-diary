import "server-only";
import { getEnvConfig } from "@/lib/config/env";
import { githubFetch } from "./client";
import { DiaryPageSummary } from "@/types/models/diary-summary";

let cachedIndex: DiaryPageSummary[] | null = null;
let indexCacheTime = 0;
const INDEX_CACHE_TTL = 30 * 1000; // 30 seconds

export async function loadMetaIndex(): Promise<DiaryPageSummary[]> {
  const now = Date.now();
  if (cachedIndex && now - indexCacheTime < INDEX_CACHE_TTL) {
    return cachedIndex;
  }

  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();
  const res = await githubFetch(`/repos/${owner}/${repo}/contents/content/index/meta-index.json?ref=${branch}`);

  if (res.status === 404) {
    // Treat missing meta-index as empty repository instead of throwing fatal errors
    return [];
  }

  if (!res.ok) {
    throw new Error(`META_INDEX_FETCH_FAILED: ${res.status}`);
  }

  const metadata = await res.json();
  if (!metadata.content) {
    return [];
  }

  const rawContent = Buffer.from(metadata.content, "base64").toString("utf-8");
  const parsed = JSON.parse(rawContent);

  if (!parsed || !Array.isArray(parsed.pages)) {
    throw new Error("META_INDEX_INVALID");
  }

  // Map and sort pages by updatedAt (descending) so newest memories are first
  const pages: DiaryPageSummary[] = parsed.pages.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    cover: p.cover || null,
    updatedAt: p.updatedAt,
    date: p.date,
    tags: Array.isArray(p.tags) ? p.tags : [],
    favorite: p.favorite,
    archived: p.archived,
  }));

  pages.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  cachedIndex = pages;
  indexCacheTime = now;
  return pages;
}
