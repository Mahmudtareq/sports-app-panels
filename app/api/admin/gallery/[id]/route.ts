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
import { updateGallerySchema } from "@/lib/validation-schema";
import { Gallery } from "@/model/Gallery";
import { Types } from "mongoose";

//!delete gallery
export const DELETE = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing gallery id!");
  }
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const existingData = await Gallery.findById(id);
  if (!existingData) {
    return apiResponse(false, 404, "Gallery not found!");
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

  await Gallery.findByIdAndDelete(id);
  return apiResponse(true, 200, "Gallery deleted successfully!");
}, true);

//!single gallery
export const GET = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing gallery id!");
  }
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const [result] = await Gallery.aggregate([
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
  if (!result) {
    return apiResponse(false, 404, "Gallery not found!");
  }
  return apiResponse(true, 200, "Gallery fetched successfully!", result);
}, true);

//!update gallery
export const PUT = asyncFormDataHandler(
  updateGallerySchema,
  async (req, data, formData: FormData, params) => {
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return apiResponse(false, 400, "Invalid banner id");
    }
    //! check existing
    const existingGallery = await Gallery.findById(id).lean();
    if (!existingGallery) {
      return apiResponse(false, 400, "no gallery found ");
    }

    let imagePublicId = existingGallery?.image;
    const image = formData.get("image") as File | null;
    if (image) {
      const { valid, error } = fileValidator(image);
      if (!valid) return apiResponse(false, 400, error!);
      const folderName = await getCloudinaryFolderName();

      //! upload image
      const { public_id } = await uploadToCloudinary(image, {
        folder: `${folderName}/gallery`,
      });

      imagePublicId = public_id;
      if (existingGallery.image) {
        await deleteFromCloudinary(existingGallery.image);
      }
    }

    const updateData = {
      ...data,
      image: imagePublicId,
    };

    const result = await Gallery.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return apiResponse(
      true,
      200,
      "Banner has been updated successfully!",
      result,
    );
  },
  true,
);
