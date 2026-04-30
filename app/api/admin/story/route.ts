import { cloudinarySecureUrlBase } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { cleanupCloudinaryAssets } from "@/lib/helper";
import { mongoAdapter } from "@/lib/mongo-adapter";
import pick from "@/lib/pick";
import { apiResponse } from "@/lib/server.utils";
import { createStorySchema } from "@/lib/validation-schema";
// import { createStorySchema } from "@/lib/validation-schema";
import { IStories, Stories } from "@/model/Stories";
import { Types } from "mongoose";

//!create

export const POST = asyncHandler(createStorySchema, async (req, data) => {
  const { slug, category = [], image, photos = [] } = data;

  try {
    const existStory = await Stories.findOne({ slug });
    if (existStory) {
      await cleanupCloudinaryAssets(data, ["image", "photos"]);
      return apiResponse(false, 409, `${slug} slug already exist`);
    }

    const categories = category.map((c) => new Types.ObjectId(c));

    // Create story
    const result = await Stories.create({
      ...data,
      category: categories,
    });

    return apiResponse(true, 201, "Stories created successfully", result);
  } catch (error) {
    await cleanupCloudinaryAssets(data, ["image", "photos"]);

    return apiResponse(false, 500, "Failed to create story", error);
  }
});

//!get all
export const GET = asyncHandler(async (req, params) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams);
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const search = query.search;

  const whareCondition: Record<string, any> = {};
  if (search) {
    const searchableFields = ["title", "description", "client", "photographer"];

    const searchConditions = searchableFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));

    whareCondition.$or = searchConditions;
  }
  const result = await mongoAdapter.aggregateWithPagination<IStories>(Stories, {
    page: paginationOptions.page,
    limit: paginationOptions.limit,
    match: whareCondition,
    sort: {
      [paginationOptions?.sortBy || "createdAt"]:
        paginationOptions?.sortOrder === "desc" ? -1 : 1,
    },
    lookups: [
      {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
      },
    ],
    extraStages: [
      {
        $addFields: {
          image: {
            $concat: [CLOUDINARY_SECURE_URL_BASE, "/", "$image"],
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
    ],
  });
  return apiResponse(true, 200, "Stories fetch successfully!", result);
}, true);
