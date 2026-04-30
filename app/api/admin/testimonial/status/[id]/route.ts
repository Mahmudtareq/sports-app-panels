import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { statusSchema } from "@/lib/validation-schema";
import { Testimonial } from "@/model/Testimonial";

//  status update
export const PUT = asyncHandler(
  statusSchema,
  async (req, data, params) => {
    const { id } = params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) return apiResponse(false, 404, "Testimonial not found!");

    await Testimonial.findByIdAndUpdate(id, data);

    return apiResponse(
      true,
      200,
      "Testimonial status has been updated successfully!",
    );
  },
  true,
);
