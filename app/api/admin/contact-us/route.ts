import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { Contactus } from "@/model/ContactUs";

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
    const searchableFields = ["name", "message", "phone", "email"];
    andConditions.push({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    });
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const data = await Contactus.aggregate([
    {
      $match: whereCondition,
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
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

  // find(whereCondition)
  //   .populate("category")
  //   .sort({ [sortBy]: sortOrder })
  //   .skip(skip)
  //   .limit(limit);

  const total = await Contactus.countDocuments(whereCondition);

  return apiResponse(true, 200, "Contact us fetched successfully!", {
    docs: data,

    totalDocs: total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
}, true);
