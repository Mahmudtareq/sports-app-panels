import {
  cloudinarySecureUrlBase,
  deleteFromCloudinary,
} from "@/config/cloudinary";

type CleanupResult = {
  success: boolean;
  deleted: string[];
  failed: string[];
};

export const cleanupCloudinaryAssets = async (
  data: Record<string, any>,
  keys: string[]
): Promise<CleanupResult> => {
  const base = await cloudinarySecureUrlBase();

  const toPublicId = (url?: string) => {
    if (!url) return undefined;
    return url.startsWith("http") ? url.replace(`${base}/`, "") : url;
  };

  const deleted: string[] = [];
  const failed: string[] = [];
  const tasks: Promise<any>[] = [];

  for (const key of keys) {
    const value = data?.[key];

    if (!value) continue;

    if (typeof value === "string") {
      const publicId = toPublicId(value);
      if (!publicId) continue;

      tasks.push(
        deleteFromCloudinary(publicId)
          .then(() => deleted.push(publicId))
          .catch(() => failed.push(publicId))
      );
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const publicId = toPublicId(item);
        if (!publicId) continue;

        tasks.push(
          deleteFromCloudinary(publicId)
            .then(() => deleted.push(publicId))
            .catch(() => failed.push(publicId))
        );
      }
    }
  }

  await Promise.allSettled(tasks);

  return {
    success: failed.length === 0,
    deleted,
    failed,
  };
};
