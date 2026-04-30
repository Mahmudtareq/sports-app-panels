import { cloudinarySecureUrlBase } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { mongoAdapter } from "@/lib/mongo-adapter";
import pick from "@/lib/pick";
import { apiResponse } from "@/lib/server.utils";
import { IStories, Stories } from "@/model/Stories";

export const GET = asyncHandler(async (req) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams);
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const isFeatured = query.isFeatured;

  const matchQuery: Record<string, any> = {
    status: true,
  };
  if (isFeatured) {
    matchQuery["isFeatured"] = isFeatured == "true";
  }

  const result = await mongoAdapter.aggregateWithPagination<IStories>(Stories, {
    page: paginationOptions.page,
    limit: paginationOptions.limit,
    match: matchQuery,
    sort: {
      [paginationOptions?.sortBy || "createdAt"]:
        paginationOptions?.sortOrder === "desc" ? -1 : 1,
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
  return apiResponse(true, 200, "Stories fetch successfully!", result);
});
