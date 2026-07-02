import "server-only";
import crypto from "crypto";
import { MediaAsset } from "@/types/models/media-asset";
import { writeGitHubFile } from "@/lib/github/write";
import { getEnvConfig } from "@/lib/config/env";

export async function saveMediaAsset({
  filename,
  base64Content,
  size,
  width,
  height,
}: {
  filename: string;
  base64Content: string;
  size: number;
  width: number;
  height: number;
}): Promise<MediaAsset> {
  const { githubOwner: owner, githubRepo: repo, githubBranch: branch } = getEnvConfig();

  const uuid = crypto.randomUUID();
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  const targetFilename = `${uuid}.webp`;
  const relativePath = `assets/images/${year}/${month}/${targetFilename}`;
  
  // Format standard GitHub raw usercontent URL
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${relativePath}`;

  // Call low-level write helper with base64 encoding mode
  const { sha } = await writeGitHubFile({
    path: relativePath,
    content: base64Content,
    message: `upload: add media asset "${targetFilename}"`,
    contentEncoding: "base64",
  });

  return {
    id: uuid,
    filename: targetFilename,
    path: relativePath,
    url,
    mimeType: "image/webp",
    width,
    height,
    size,
    uploadedAt: date.toISOString(),
  };
}
