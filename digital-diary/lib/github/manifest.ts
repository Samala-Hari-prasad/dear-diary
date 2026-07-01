import "server-only";
import { getEnvConfig } from "@/lib/config/env";
import { githubFetch } from "./client";

let cachedManifest: any = null;
let manifestCacheTime = 0;
const MANIFEST_CACHE_TTL = 60 * 1000; // 60 seconds

export async function loadManifest(): Promise<any> {
  const now = Date.now();
  if (cachedManifest && now - manifestCacheTime < MANIFEST_CACHE_TTL) {
    return cachedManifest;
  }

  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();
  const res = await githubFetch(`/repos/${owner}/${repo}/contents/manifest.json?ref=${branch}`);

  if (!res.ok) {
    throw new Error(`MANIFEST_FETCH_FAILED: ${res.status}`);
  }

  const metadata = await res.json();
  if (!metadata.content) {
    throw new Error("MANIFEST_EMPTY");
  }

  const rawContent = Buffer.from(metadata.content, "base64").toString("utf-8");
  const manifestData = JSON.parse(rawContent);

  cachedManifest = manifestData;
  manifestCacheTime = now;
  return manifestData;
}
