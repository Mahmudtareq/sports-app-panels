import { cloudinarySecureUrlBase } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import ServiceGallery from "@/model/ServiceGallery";

export const GET = asyncHandler(async (req) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const data = await ServiceGallery.aggregate([
    {
      $match: {
        status: true,
      },
    },
    {
      $addFields: {
        image: {
          $concat: [CLOUDINARY_SECURE_URL_BASE, "/", "$image"],
        },
      },
    },
    {
      $sort: {
        position: 1,
      },
    },
  ]);

  return apiResponse(true, 200, "service gallery fetched successfully", data);
});
