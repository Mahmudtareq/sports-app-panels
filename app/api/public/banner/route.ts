import { cloudinarySecureUrlBase } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import Banner from "@/model/Banner";

export const GET = asyncHandler(async (req) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const [result] = await Banner.aggregate([
    {
      $facet: {
        data: [
          { $match: { status: true } },
          { $sort: { position: 1 } },
          {
            $project: {
              heading: 1,
              shortDesc: 1,
              image: {
                $concat: [CLOUDINARY_SECURE_URL_BASE, "/", "$image"],
              },
              imageTwo: 1,
              position: 1,
              status: 1,
              categories: 1,
            },
          },
        ],
        categories: [
          { $match: { categories: { $exists: true, $ne: null } } },
          { $group: { _id: "$categories" } },
          { $project: { _id: 0, category: "$_id" } },
        ],
      },
    },
  ]);
  return apiResponse(true, 200, "Banner fetched successfully!", result);
});
