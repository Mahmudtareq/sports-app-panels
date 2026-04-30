import {
  cloudinarySecureUrlBase,
  getCloudinaryFolderName,
  uploadToCloudinary,
} from "@/config/cloudinary";
import { asyncFormDataHandler } from "@/lib/async-formdata-handler";
import { asyncHandler } from "@/lib/async-handler";
import { fileValidator } from "@/lib/file-validator";
import { apiResponse } from "@/lib/server.utils";
import { createGallerySchema } from "@/lib/validation-schema";
import { Gallery } from "@/model/Gallery";

//! create gallery
export const POST = asyncFormDataHandler(
  createGallerySchema,
  async (req, data, formData: FormData) => {
    const image = formData.get("image") as File;
    const { valid: validImage, error: errorOne } = fileValidator(image, {
      required: true,
    });

    if (!validImage) {
      return apiResponse(false, 400, errorOne || "Image is required!");
    }
    const folderName = await getCloudinaryFolderName();

    //upload image
    const { public_id: imageId } = await uploadToCloudinary(
      formData.get("image") as File,
      {
        folder: `${folderName}/gallery`,
      },
    );

    const payloadData: Record<string, any> = {
      ...data,
      image: imageId,
    };

    const result = await Gallery.create(payloadData);
    return apiResponse(true, 201, "Gallery created Successfully", result);
  },
  true,
);

//!all gallery
export const GET = asyncHandler(async (req) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const result = await Gallery.aggregate([
    {
      $sort: { orderBy: 1 },
    },
    {
      $addFields: {
        image: {
          $concat: [CLOUDINARY_SECURE_URL_BASE, "/", "$image"],
        },
      },
    },
  ]);
  return apiResponse(true, 200, "Gallery fatch successfully", result);
}, true);
