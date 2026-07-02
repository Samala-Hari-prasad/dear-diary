export const MEDIA_CONFIG = {
  MAX_WIDTH: 1200,
  MAX_HEIGHT: 1200,
  QUALITY: 0.82,
  FORMAT: "image/webp" as const,
  TARGET_SIZE_BYTES: 250 * 1024, // 250 KB
  MAX_UPLOAD_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ] as const,
} as const;
