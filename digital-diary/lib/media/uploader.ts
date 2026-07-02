import { compressImage, getBlobDimensions } from "./compressor";
import { MediaAsset } from "@/types/models/media-asset";

export async function uploadMedia(file: File): Promise<MediaAsset> {
  const webpBlob = await compressImage(file);
  const { width, height } = await getBlobDimensions(webpBlob);

  const base64String = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(webpBlob);
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const split = base64.split(",")[1];
      if (split) {
        resolve(split);
      } else {
        reject(new Error("BASE64_CONVERSION_FAILED"));
      }
    };
    reader.onerror = () => {
      reject(new Error("FILE_READ_ERROR"));
    };
  });

  const res = await fetch("/api/v1/diary/media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      content: base64String,
      size: webpBlob.size,
      width,
      height,
    }),
  });

  const result = await res.json();
  if (result.success && result.data) {
    return result.data as MediaAsset;
  }

  throw new Error(result.error?.code || "UPLOAD_FAILED");
}
