export async function compressImage(
  file: File,
  targetMB: number = 1,
  maxWidthOrHeight: number = 1920,
  thresholdMB: number = 1,
): Promise<File> {
  // Skip non-images or SVG (can't be canvas-drawn reliably)
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  const thresholdBytes = thresholdMB * 1024 * 1024;

  // Under the threshold — skip compression entirely
  if (file.size <= thresholdBytes) return file;

  const targetBytes = targetMB * 1024 * 1024;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Step 1: Scale down dimensions if too large
      let { width, height } = img;
      if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
        const ratio = Math.min(
          maxWidthOrHeight / width,
          maxWidthOrHeight / height,
        );
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));

      ctx.drawImage(img, 0, 0, width, height);

      // Step 2: Iteratively reduce quality until under target size
      const outputType = file.type === "image/png" ? "image/jpeg" : file.type;
      let quality = 0.85;
      const MIN_QUALITY = 0.1;
      const STEP = 0.1;

      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));

            if (blob.size <= targetBytes || quality <= MIN_QUALITY) {
              // Done — wrap blob back into a File
              const ext =
                outputType === "image/jpeg"
                  ? "jpg"
                  : (file.name.split(".").pop() ?? "jpg");
              const baseName = file.name.replace(/\.[^/.]+$/, "");
              const compressedFile = new File(
                [blob],
                `${baseName}_compressed.${ext}`,
                { type: outputType, lastModified: Date.now() },
              );
              resolve(compressedFile);
            } else {
              quality = Math.max(quality - STEP, MIN_QUALITY);
              tryCompress();
            }
          },
          outputType,
          quality,
        );
      };

      tryCompress();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

/**
 * Compresses multiple image files in parallel.
 */
export async function compressImages(
  files: File[],
  targetMB: number = 2,
  maxWidthOrHeight: number = 1920,
  thresholdMB: number = 1,
): Promise<File[]> {
  return Promise.all(
    files.map((file) =>
      compressImage(file, targetMB, maxWidthOrHeight, thresholdMB),
    ),
  );
}
