import { MEDIA_CONFIG } from "@/constants/media";

export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (file.size > MEDIA_CONFIG.MAX_UPLOAD_SIZE_BYTES) {
      return reject(new Error("FILE_TOO_LARGE"));
    }
    
    if (!MEDIA_CONFIG.ALLOWED_TYPES.includes(file.type as any)) {
      return reject(new Error("UNSUPPORTED_TYPE"));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > MEDIA_CONFIG.MAX_WIDTH || height > MEDIA_CONFIG.MAX_HEIGHT) {
          const ratio = Math.min(
            MEDIA_CONFIG.MAX_WIDTH / width,
            MEDIA_CONFIG.MAX_HEIGHT / height
          );
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("CANVAS_CONTEXT_ERROR"));
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("COMPRESSION_FAILED"));
            }
          },
          MEDIA_CONFIG.FORMAT,
          MEDIA_CONFIG.QUALITY
        );
      };
      img.onerror = () => {
        reject(new Error("IMAGE_LOAD_ERROR"));
      };
    };
    reader.onerror = () => {
      reject(new Error("FILE_READ_ERROR"));
    };
  });
}
export async function getBlobDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
  });
}
