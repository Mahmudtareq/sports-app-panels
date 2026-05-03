import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import Settings from "@/model/Settings";
import { NextRequest } from "next/server";

export const GET = asyncHandler(async (req: NextRequest) => {
  const { general } = (await Settings.findOne({}).select("general")) || {};
  if (!general) {
    return apiResponse(false, 404, "General settings not found!");
  }
  return apiResponse(
    true,
    200,
    "Settings data has been fetched successfully!",
    general.toObject(),
  );
});
