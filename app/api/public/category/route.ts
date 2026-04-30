import { cloudinarySecureUrlBase } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { mongoAdapter } from "@/lib/mongo-adapter";
import { apiResponse } from "@/lib/server.utils";
import Category from "@/model/Category";

export const GET = asyncHandler(async (req) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams);
  // const { page, limit, sortBy, sortOrder, noPagination } = pick(query, [
  //   "page",
  //   "limit",
  //   "sortBy",
  //   "sortOrder",
  //   "noPagination",
  // ]);
  const matchQuery: Record<string, any> = {
    status: true,
  };
  // const paginationQuery: Record<string, any> =
  //   noPagination === "true" ? { skipPagination: true, limit } : { page, limit };

  const result = await mongoAdapter.aggregateWithPagination(Category, {
    match: matchQuery,
    sort: {
      position: 1,
    },
    skipPagination: true,
  });
  return apiResponse(true, 200, "Category fetch successfully!", result);
});
