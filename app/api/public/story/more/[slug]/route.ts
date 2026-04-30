import { cloudinarySecureUrlBase } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { Stories } from "@/model/Stories";

export const GET = asyncHandler(async (req, params) => {
  const { slug } = params;
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const result = await Stories.aggregate([
    { $match: { slug: { $ne: slug } } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $limit: 10,
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

  // find({
  //   slug: { $ne: slug },
  //   status: true,
  // }).limit(10);
  if (!result) {
    return apiResponse(false, 404, "No data found");
  }
  return apiResponse(true, 200, "Stories fetch successfully!", result);
});
