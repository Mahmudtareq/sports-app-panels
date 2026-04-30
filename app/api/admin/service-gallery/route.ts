import {
  cloudinarySecureUrlBase,
  getCloudinaryFolderName,
  uploadToCloudinary,
} from "@/config/cloudinary";
import { asyncFormDataHandler } from "@/lib/async-formdata-handler";
import { asyncHandler } from "@/lib/async-handler";
import { fileValidator } from "@/lib/file-validator";
import { apiResponse } from "@/lib/server.utils";
import { createServiceGallerySchema } from "@/lib/validation-schema";
import ServiceGallery from "@/model/ServiceGallery";
import { NextRequest } from "next/server";

//! service gallery
export const POST = asyncFormDataHandler(
  createServiceGallerySchema,
  async (req: NextRequest, data, formData: FormData) => {
    const image = formData.get("image") as File;
    const { valid, error } = fileValidator(image, { required: true });

    if (!valid) {
      return apiResponse(false, 400, error || "Image One is required!");
    }
    const folderName = await getCloudinaryFolderName();

    const { public_id } = await uploadToCloudinary(image, {
      folder: `${folderName}/service-gallery`,
    });
    const serviceGalleryData = {
      ...data,
      image: public_id,
    };
    const result = await ServiceGallery.create(serviceGalleryData);
    return apiResponse(
      true,
      200,
      "Service gallery has been created  successfully!",
      result,
    );
  },
  true,
);

//! gets all
export const GET = asyncHandler(async (req) => {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const filter: Record<string, unknown> = {};
  if (statusParam === "true") filter.status = true;
  else if (statusParam === "false") filter.status = false;
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const serviceGallery = await ServiceGallery.aggregate([
    {
      $sort: {
        position: 1,
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

  if (!serviceGallery) {
    return apiResponse(false, 404, "service gallery not found");
  }
  return apiResponse(true, 200, "Success", serviceGallery);
}, true);
