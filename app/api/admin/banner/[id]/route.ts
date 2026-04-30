import {
  cloudinarySecureUrlBase,
  deleteFromCloudinary,
  getCloudinaryFolderName,
  uploadToCloudinary,
} from "@/config/cloudinary";
import { asyncFormDataHandler } from "@/lib/async-formdata-handler";
import { asyncHandler } from "@/lib/async-handler";
import { fileValidator } from "@/lib/file-validator";
import { apiResponse } from "@/lib/server.utils";
import { bannerSchema } from "@/lib/validation-schema";
import Banner from "@/model/Banner";
import { Types } from "mongoose";

//! update banner
export const PUT = asyncFormDataHandler(
  bannerSchema.partial(),
  async (req, data, formData, params) => {
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return apiResponse(false, 400, "Invalid banner id");
    }

    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return apiResponse(false, 404, "Banner not found");
    }

    let imagePublicId = existingBanner.image;

    const image = formData.get("image") as File | null;

    if (image) {
      const { valid, error } = fileValidator(image);
      if (!valid) return apiResponse(false, 400, error!);
      const folderName = await getCloudinaryFolderName();

      // upload new image
      const { public_id } = await uploadToCloudinary(image, {
        folder: `${folderName}/banner`,
      });

      imagePublicId = public_id;

      // delete old image
      if (existingBanner.image) {
        await deleteFromCloudinary(existingBanner.image);
      }
    }

    const bannerData = {
      ...data,
      image: imagePublicId,
    };

    await Banner.findByIdAndUpdate(id, bannerData, {
      new: true,
    });

    return apiResponse(true, 200, "Banner has been updated successfully!");
  },
  true,
);

//! delete banner
export const DELETE = asyncHandler<{ id: string }>(async (req, params) => {
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid banner id");
  }
  const banner = await Banner.findById(id);
  if (!banner) return apiResponse(false, 404, "Banner not found!");

  // Delete image from Cloudinary if exists
  if (banner.image) await deleteFromCloudinary(banner.image);

  await Banner.findByIdAndDelete(id);

  return apiResponse(true, 200, "Banner has been deleted successfully!");
}, true);

//!Get single banner
export const GET = asyncHandler<{ id: string }>(async (req, params) => {
  const { id } = params;
  if (!Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid banner id");
  }
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const [banner] = await Banner.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },
    {
      $addFields: {
        image: {
          $concat: [CLOUDINARY_SECURE_URL_BASE, "/", "$image"],
        },
      },
    },
  ]);
  return apiResponse(
    true,
    200,
    "Single banner has been fetched successfully!",
    banner,
  );
}, true);
