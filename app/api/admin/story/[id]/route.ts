import {
  cloudinarySecureUrlBase,
  deleteFromCloudinary,
} from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { updateStorySchema } from "@/lib/validation-schema";
import { Stories } from "@/model/Stories";
import { Types } from "mongoose";

//! single story
export const GET = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing story id!");
  }

  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const [result] = await Stories.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $addFields: {
        image: {
          $concat: [{ $literal: CLOUDINARY_SECURE_URL_BASE + "/" }, "$image"],
        },
        photos: {
          $map: {
            input: "$photos",
            as: "p",
            in: {
              $concat: [CLOUDINARY_SECURE_URL_BASE, "/", "$$p"],
            },
          },
        },
      },
    },
  ]);

  if (!result) {
    return apiResponse(false, 404, "Story not found!");
  }

  return apiResponse(true, 200, "Story fetched successfully!", result);
}, true);

//!update story
export const PUT = asyncHandler(
  updateStorySchema,
  async (req, data, params) => {
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return apiResponse(false, 400, "Invalid story id");
    }

    const existingStory = await Stories.findById(id);
    if (!existingStory) {
      return apiResponse(false, 404, "Story not found");
    }

    if (data.slug) {
      const slugExist = await Stories.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });

      if (slugExist) {
        return apiResponse(false, 409, "Slug already exists");
      }
    }

    const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

    const toPublicId = (url?: string) => {
      if (!url) return undefined;
      return url.startsWith("http")
        ? url.replace(`${CLOUDINARY_SECURE_URL_BASE}/`, "")
        : url;
    };

    let imagePublicId = existingStory.image;

    if (data.image) {
      const incomingImage = toPublicId(data.image);

      if (incomingImage !== existingStory.image) {
        if (existingStory.image) {
          await deleteFromCloudinary(existingStory.image);
        }
        imagePublicId = incomingImage;
      }
    }

    let photosPublicIds = existingStory.photos || [];

    if (data.photos) {
      const incomingPhotos = data.photos
        .map(toPublicId)
        .filter(Boolean) as string[];

      // detect removed photos
      const removedPhotos = photosPublicIds.filter(
        (p: string) => !incomingPhotos.includes(p),
      );

      // delete removed
      for (const photo of removedPhotos) {
        if (photo) await deleteFromCloudinary(photo);
      }

      photosPublicIds = incomingPhotos;
    }

    const categories = data.category
      ? data.category.map((c) => new Types.ObjectId(c))
      : undefined;

    const result = await Stories.findByIdAndUpdate(
      id,
      {
        ...data,
        image: imagePublicId,
        photos: photosPublicIds,
        ...(categories && { category: categories }),
      },
      { new: true },
    );

    return apiResponse(
      true,
      200,
      "Stories has been updated successfully!",
      result,
    );
  },
  true,
);

//!delete story
export const DELETE = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing story id!");
  }
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const existingData = await Stories.findById(id);
  if (!existingData) {
    return apiResponse(false, 404, "Stories not found!");
  }

  if (existingData.image) {
    try {
      const key = existingData.image.startsWith("http")
        ? existingData.image.replace(`${CLOUDINARY_SECURE_URL_BASE}/`, "")
        : existingData.image;
      await deleteFromCloudinary(key);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }
  }
  await Stories.findByIdAndDelete(id);
  return apiResponse(true, 200, "Stories deleted successfully!");
});
