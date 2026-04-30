import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { statusSchema } from "@/lib/validation-schema";
import Banner from "@/model/Banner";

//! Banner status update
export const PUT = asyncHandler(
  statusSchema,
  async (req, data, params) => {
    const { id } = params;

    const banner = await Banner.findById(id);
    if (!banner) return apiResponse(false, 404, "Banner not found!");

    await Banner.findByIdAndUpdate(id, data);

    return apiResponse(
      true,
      200,
      "Banner status has been updated successfully!",
    );
  },
  true,
);
