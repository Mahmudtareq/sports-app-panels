import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { Subscribe } from "@/model/Subscribe";

export const GET = asyncHandler(async (req) => {
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;
  const search = query.search;

  const andConditions: any[] = [];
  if (search?.trim().length) {
    const searchableFields = ["phone"];
    andConditions.push({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    });
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const data = await Subscribe.aggregate([
    {
      $match: whereCondition,
    },
    {
      $sort: { [sortBy]: sortOrder },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const total = await Subscribe.countDocuments(whereCondition);

  return apiResponse(true, 200, "Subscribe List fetched successfully!", {
    docs: data,
    totalDocs: total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
}, true);
