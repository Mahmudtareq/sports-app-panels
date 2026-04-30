import { cloudinarySecureUrlBase } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { Team } from "@/model/Team";

export const GET = asyncHandler(async (req) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const result = await Team.aggregate([
    { $match: { status: true } },
    {
      $addFields: {
        image: {
          $concat: [{ $literal: CLOUDINARY_SECURE_URL_BASE + "/" }, "$image"],
        },
      },
    },
    {
      $sort: {
        order: 1,
      },
    },
  ]);

  return apiResponse(true, 200, "Team fetched successfully", result);
});
