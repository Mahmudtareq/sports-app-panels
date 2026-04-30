import { cloudinarySecureUrlBase } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { Testimonial } from "@/model/Testimonial";

export const GET = asyncHandler(async (req) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const result = await Testimonial.aggregate([
    {
      $match: {
        status: true,
      },
    },
    {
      $sort: {
        order: 1,
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

  return apiResponse(true, 200, "Fetch testimonial successfully!", result);
});
