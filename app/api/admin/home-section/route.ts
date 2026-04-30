import {
  cloudinarySecureUrlBase,
  deleteFromCloudinary,
} from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { HomeSectionSchema } from "@/lib/validation-schema";
import HomeSection from "@/model/HomeSection";
import { Types } from "mongoose";

export const POST = asyncHandler(HomeSectionSchema, async (req, data) => {
  const {
    sectionKey,

    serviceIds,
    images = [],
    videos = [],
    features = [],
    sectionImage,
  } = data;
  if (!sectionKey) {
    return apiResponse(false, 400, "Section key is missing!");
  }

  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  // Safe helper to convert full URL -> publicId
  const toPublicId = (url?: string) => {
    if (!url) return undefined;
    return url.startsWith("http")
      ? url.replace(`${CLOUDINARY_SECURE_URL_BASE}/`, "")
      : url;
  };

  const serviceObjectIds =
    serviceIds?.map((id) => new Types.ObjectId(id)) || [];

  try {
    const existing = await HomeSection.findOne({ sectionKey });

    // Normalize incoming arrays (remove undefined/null)
    const normalizedImages = images.map(toPublicId).filter(Boolean) as string[];
    const normalizedVideos = videos.map(toPublicId).filter(Boolean) as string[];
    const normalizedSectionImage = toPublicId(sectionImage);

    data.sectionImage = normalizedSectionImage;
    // Delete removed images
    if (existing?.images?.length) {
      const removedImages = existing.images.filter(
        (img: string) => !normalizedImages.includes(img),
      );
      for (const img of removedImages) {
        if (img) await deleteFromCloudinary(img);
      }
    }

    // Delete removed videos
    if (existing?.videos?.length) {
      const removedVideos = existing.videos.filter(
        (vid: string) => !normalizedVideos.includes(vid),
      );
      for (const vid of removedVideos) {
        if (vid) await deleteFromCloudinary(vid);
      }
    }
    // Upsert HomeSection
    const result = await HomeSection.findOneAndUpdate(
      { sectionKey },
      {
        $set: {
          ...data,
          images: normalizedImages,
          videos: normalizedVideos,

          serviceIds: serviceObjectIds,
        },
      },
      { new: true, upsert: true },
    );

    return apiResponse(true, 200, "Home section saved successfully", result);
  } catch (err) {
    // Cleanup newly uploaded resources on error
    const cleanup = async (arr?: string[]) => {
      if (!arr?.length) return;
      for (const url of arr) {
        const publicId = toPublicId(url);
        if (publicId) await deleteFromCloudinary(publicId);
      }
    };

    await cleanup(images);
    await cleanup(videos);

    return apiResponse(false, 500, "Failed to save home section", err);
  }
});
