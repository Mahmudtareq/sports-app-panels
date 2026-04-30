import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { statusSchema } from "@/lib/validation-schema";
import ServiceGallery from "@/model/ServiceGallery";

//! service gallery status update
export const PUT = asyncHandler(
  statusSchema,
  async (req, data, params) => {
    const { id } = params;

    const servicegallery = await ServiceGallery.findById(id);
    if (!servicegallery) return apiResponse(false, 404, "data not found!");

    await ServiceGallery.findByIdAndUpdate(id, data);

    return apiResponse(
      true,
      200,
      "Service Gallery status has been updated successfully!",
    );
  },
  true,
);
