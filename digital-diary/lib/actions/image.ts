"use server";
import { getSession } from "@/lib/auth/session";
import { saveBinaryFile } from "@/lib/github/repository";

export async function uploadImage(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64Content = buffer.toString("base64");
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}.${ext}`;
  
  await saveBinaryFile(`content/images/${filename}`, base64Content);
  
  return `https://raw.githubusercontent.com/Samala-Hari-prasad/dear-diary/main/content/images/${filename}`;
}
