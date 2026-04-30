import {
  cloudinarySecureUrlBase,
  getCloudinaryFolderName,
  uploadToCloudinary,
} from "@/config/cloudinary";
import { asyncFormDataHandler } from "@/lib/async-formdata-handler";
import { asyncHandler } from "@/lib/async-handler";
import { fileValidator } from "@/lib/file-validator";
import { apiResponse } from "@/lib/server.utils";
import { bannerSchema } from "@/lib/validation-schema";
import Banner from "@/model/Banner";
import { NextRequest } from "next/server";
import z from "zod";

// Create a banner
export const POST = asyncFormDataHandler(
  bannerSchema,
  async (
    req: NextRequest,
    data: z.infer<typeof bannerSchema>,
    formData: FormData,
  ) => {
    // Validate image
    const image = formData.get("image") as File;
    const { valid, error } = fileValidator(image, { required: true });

    if (!valid) {
      return apiResponse(false, 400, error || "Image One is required!");
    }

    const existingBannerUsingCategory = await Banner.findOne({
      categories: data.categories,
    });

    if (existingBannerUsingCategory) {
      return apiResponse(false, 400, "This Category Banner already exists");
    }

    const folderName = await getCloudinaryFolderName();

    const { public_id } = await uploadToCloudinary(image, {
      folder: `${folderName}/banner`,
    });

    const bannerData = {
      ...data,
      image: public_id,
    };

    //  create
    const result = await Banner.create(bannerData);

    return apiResponse(
      true,
      200,
      "Banner has been created  successfully!",
      result,
    );
  },
  true,
);

// Get all banners
export const GET = asyncHandler(async (req) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const { searchParams } = new URL(req.url);
  const sectionName = searchParams.get("sectionName");
  if (!sectionName) {
    return apiResponse(false, 400, "sectionName is required");
  }
  const statusParam = searchParams.get("status");
  const filter: Record<string, unknown> = { sectionName };

  if (statusParam === "true") filter.status = true;
  else if (statusParam === "false") filter.status = false;
  const banner = await Banner.aggregate([
    {
      $match: filter,
    },
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

  if (!banner) {
    return apiResponse(false, 404, "banner not found");
  }

  return apiResponse(true, 200, "Success", banner);
}, true);
