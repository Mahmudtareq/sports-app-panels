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
import { createServiceGallerySchema } from "@/lib/validation-schema";
import ServiceGallery from "@/model/ServiceGallery";
import { Types } from "mongoose";

//!update
export const PUT = asyncFormDataHandler(
  createServiceGallerySchema.partial(),
  async (req, data, formData, params) => {
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return apiResponse(false, 400, "Invalid  id");
    }

    const existingData = await ServiceGallery.findById(id);
    if (!existingData) {
      return apiResponse(false, 404, "Service  not found");
    }

    let imagePublicId = existingData.image;

    const image = formData.get("image") as File | null;

    if (image) {
      const { valid, error } = fileValidator(image);
      if (!valid) return apiResponse(false, 400, error!);
      const folderName = await getCloudinaryFolderName();

      // upload new image
      const { public_id } = await uploadToCloudinary(image, {
        folder: `${folderName}/service-gallery`,
      });

      imagePublicId = public_id;

      // delete old image
      if (existingData.image) {
        await deleteFromCloudinary(existingData.image);
      }
    }

    const updatedData = {
      ...data,
      image: imagePublicId,
    };

    await ServiceGallery.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return apiResponse(
      true,
      200,
      "ServiceGallery has been updated successfully!",
    );
  },
  true,
);
//!Get single service gallery
export const GET = asyncHandler<{ id: string }>(async (req, params) => {
  const { id } = params;
  if (!Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid  id");
  }
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const [result] = await ServiceGallery.aggregate([
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
    return apiResponse(false, 404, "data not found!");
  }
  return apiResponse(
    true,
    200,
    "Single Service Gallery has been fetched successfully!",
    result,
  );
}, true);
//delete service gallery
export const DELETE = asyncHandler<{ id: string }>(async (req, params) => {
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid  id");
  }
  const servicegallery = await ServiceGallery.findById(id).lean();
  if (!servicegallery)
    return apiResponse(false, 404, "Service Gallery not found!");

  // Delete image from Cloudinary if exists
  if (servicegallery.image) await deleteFromCloudinary(servicegallery.image);

  await ServiceGallery.findByIdAndDelete(id);

  return apiResponse(
    true,
    200,
    "Service Gallery has been deleted successfully!",
  );
}, true);
