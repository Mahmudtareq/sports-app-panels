import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import Settings from "@/model/Settings";

export const GET = asyncHandler(async () => {
  const { general } = (await Settings.findOne({})) || {};

  if (!general) {
    return apiResponse(false, 404, "General settings not found!");
  }

  const data = {
    ...general.toObject(),
  };

  return apiResponse(
    true,
    200,
    "General settings has been fetched successfully!",
    data,
  );
}, true);
