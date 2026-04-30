import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { sortSchema } from "@/lib/validation-schema";
import { Testimonial } from "@/model/Testimonial";

// Testimonial Sorting
export const PUT = asyncHandler(
  sortSchema,
  async (req, data) => {
    const { sortedIds } = data;

    const bulkOps = sortedIds.map((item, index) => ({
      updateOne: {
        filter: { _id: item },
        update: { order: index + 1 },
      },
    }));

    await Testimonial.bulkWrite(bulkOps, { ordered: false });

    return apiResponse(true, 200, "Testimonial has been sorted successfully!");
  },
  true,
);
