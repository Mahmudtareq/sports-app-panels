import { cloudinarySecureUrlBase } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { mongoAdapter } from "@/lib/mongo-adapter";
import pick from "@/lib/pick";
import { apiResponse } from "@/lib/server.utils";
import { Gallery, IGallery } from "@/model/Gallery";
import { Types } from "mongoose";

export const GET = asyncHandler(async (req) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams);

  const { page, limit, sortBy, sortOrder, noPagination } = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "noPagination",
  ]);
  const isFeatured = query?.isFeatured;
  const category = query?.category;
  const matchQuery: Record<string, any> = {
    status: true,
  };
  if (isFeatured) {
    matchQuery["isFeatured"] = isFeatured == "true";
  }
  if (category && Types.ObjectId.isValid(category)) {
    matchQuery["category"] = new Types.ObjectId(category);
  }
  if (category) {
    matchQuery["category"] = { $regex: category, $options: "i" };
  }
  const paginationQuery: Record<string, any> =
    noPagination === "true" ? { skipPagination: true, limit } : { page, limit };
  const result = await mongoAdapter.aggregateWithPagination<IGallery>(Gallery, {
    ...paginationQuery,
    match: matchQuery,
    sort: {
      [sortBy || "createdAt"]: sortOrder === "desc" ? -1 : 1,
    },
    extraStages: [
      {
        $addFields: {
          image: {
            $concat: [CLOUDINARY_SECURE_URL_BASE, "/", "$image"],
          },
        },
      },
    ],
  });
  return apiResponse(true, 200, "Gallery fetch successfully!", result);
});
