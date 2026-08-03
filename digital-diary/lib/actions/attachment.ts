"use server";
import { getSession } from "@/lib/auth/session";
import { saveBinaryFile } from "@/lib/github/repository";

export async function uploadAttachment(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  // Basic validation (limit to 100MB happens organically via github/vercel but we can do a quick check here if we wanted)
  if (file.size > 100 * 1024 * 1024) throw new Error("File too large");

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64Content = buffer.toString("base64");
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const filename = `${Date.now()}.${ext}`;
  
  let folder = "misc";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
    folder = "images";
  } else if (["mp3", "wav", "m4a", "ogg"].includes(ext)) {
    folder = "audio";
  } else if (["pdf"].includes(ext)) {
    folder = "pdf";
  } else {
    throw new Error("Unsupported file type");
  }
  
  const path = `content/attachments/${folder}/${filename}`;
  await saveBinaryFile(path, base64Content);
  
  return `https://raw.githubusercontent.com/Samala-Hari-prasad/dear-diary/main/${path}`;
}
