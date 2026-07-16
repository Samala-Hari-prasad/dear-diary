import "server-only";
import { getEnvConfig } from "@/lib/config/env";

export async function githubFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const config = getEnvConfig();

  const url = `https://api.github.com${path}`;
  const headers = {
    Authorization: `Bearer ${config.githubToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "the-digital-diary",
    ...options.headers,
  };
  console.log(`[githubFetch] URL: ${url}`);
  console.log(`[githubFetch] Token prefix: ${config.githubToken.substring(0, 15)}... length: ${config.githubToken.length}`);

  return fetch(url, {
    ...options,
    headers,
    next: { revalidate: 0 }, // Ensure no cached status checks
  });
}
