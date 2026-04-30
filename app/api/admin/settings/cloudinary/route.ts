import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { cloudinarySchema } from "@/lib/validation-schema";
import Settings from "@/model/Settings";
import { NextRequest } from "next/server";
import z from "zod";

export const PUT = asyncHandler(
  cloudinarySchema,
  async (req: NextRequest, data: z.infer<typeof cloudinarySchema>) => {
    const updateFields = Object.entries(data).reduce(
      (acc, [key, value]) => {
        acc[`cloudinary.${key}`] = value;
        return acc;
      },
      {} as Record<string, any>,
    );

    await Settings.findOneAndUpdate(
      {},
      { $set: updateFields },
      { upsert: true },
    );

    return apiResponse(
      true,
      200,
      "Cloudinary settings has been updated successfully!",
    );
  },
  true,
);

export const GET = asyncHandler(async () => {
  const { cloudinary } = (await Settings.findOne({})) || {};

  if (!cloudinary) {
    return apiResponse(false, 404, "Cloudinary settings not found!");
  }

  return apiResponse(
    true,
    200,
    "Cloudinary settings has been fetched successfully!",
    cloudinary,
  );
}, true);
