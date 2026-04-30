import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { termsSchema } from "@/lib/validation-schema";
import Settings from "@/model/Settings";
import { NextRequest } from "next/server";
import z from "zod";

export const PUT = asyncHandler(
  termsSchema,
  async (req: NextRequest, data: z.infer<typeof termsSchema>) => {
    const updateFields = Object.entries(data).reduce(
      (acc, [key, value]) => {
        acc[`termsPolicy.${key}`] = value;
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
      "Terms & policy settings has been updated successfully!",
    );
  },
  true,
);

export const GET = asyncHandler(async () => {
  const { termsPolicy } = (await Settings.findOne({})) || {};

  if (!termsPolicy) {
    return apiResponse(false, 404, "Terms & policy settings not found!");
  }

  return apiResponse(
    true,
    200,
    "Terms & policy settings has been fetched successfully!",
    termsPolicy,
  );
}, true);
