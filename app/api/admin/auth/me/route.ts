import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { adminProfileSchema } from "@/lib/validation-schema";
import User from "@/model/User";
import { NextRequest } from "next/server";
import z from "zod";

export const GET = asyncHandler(async (req: NextRequest) => {
  const admin = await User.findOne({ _id: req.user?._id }).select("-password");

  return apiResponse(true, 200, "Admin profile fetched successfully!", admin);
}, true);

export const PUT = asyncHandler(
  adminProfileSchema,
  async (req: NextRequest, data: z.infer<typeof adminProfileSchema>) => {
    const { name } = data;
    if (name) await User.findByIdAndUpdate(req.user._id, { name });

    return apiResponse(true, 200, "Admin profile updated successfully!");
  },
  true,
);
