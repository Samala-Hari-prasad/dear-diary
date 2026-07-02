import "server-only";
import { getEnvConfig } from "@/lib/config/env";
import { githubFetch } from "./client";
import { DiaryPage } from "@/types/models/diary-page";

export async function loadPage(slug: string): Promise<DiaryPage> {
  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();
  
  // Clean slug to prevent directory traversal
  const cleanSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");
  const res = await githubFetch(`/repos/${owner}/${repo}/contents/content/pages/${cleanSlug}.json?ref=${branch}`);

  if (res.status === 404) {
    throw new Error("PAGE_NOT_FOUND");
  }

  if (!res.ok) {
    throw new Error(`PAGE_FETCH_FAILED: ${res.status}`);
  }

  const metadata = await res.json();
  if (!metadata.content) {
    throw new Error("PAGE_EMPTY");
  }

  const rawContent = Buffer.from(metadata.content, "base64").toString("utf-8");
  const parsed = JSON.parse(rawContent);

  if (!parsed || !parsed.summary || !Array.isArray(parsed.blocks)) {
    throw new Error("PAGE_INVALID");
  }

  return {
    summary: {
      id: parsed.summary.id,
      slug: parsed.summary.slug,
      title: parsed.summary.title,
      cover: parsed.summary.cover || null,
      updatedAt: parsed.summary.updatedAt,
      tags: Array.isArray(parsed.summary.tags) ? parsed.summary.tags : [],
    },
    blocks: parsed.blocks,
    sha: metadata.sha,
  };
}
