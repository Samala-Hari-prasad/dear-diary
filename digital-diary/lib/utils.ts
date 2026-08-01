import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function compressImage(file: File): Promise<File> {
  // If it's not an image, just return it
  if (!file.type.startsWith("image/")) return file;

  const MAX_WIDTH = 2048;
  const MAX_HEIGHT = 2048;
  const QUALITY = 0.8;

  const bitmap = await createImageBitmap(file);
  
  let width = bitmap.width;
  let height = bitmap.height;

  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  // Draw image to canvas, this inherently strips EXIF data
  ctx.drawImage(bitmap, 0, 0, width, height);

  // Preserve transparency for PNGs by keeping them as PNG
  const outputFormat = file.type === "image/png" ? "image/png" : "image/webp";
  const outputQuality = outputFormat === "image/webp" ? QUALITY : undefined;

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(file); // Fallback to original
          return;
        }
        
        // Ensure extension is correct
        let filename = file.name;
        if (outputFormat === "image/webp" && !filename.endsWith(".webp")) {
          filename = filename.replace(/\.[^/.]+$/, "") + ".webp";
        }
        
        const compressedFile = new File([blob], filename, {
          type: outputFormat,
          lastModified: Date.now(),
        });
        
        resolve(compressedFile);
      },
      outputFormat,
      outputQuality
    );
  });
}
