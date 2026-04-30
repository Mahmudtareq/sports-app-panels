import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { sortSchema } from "@/lib/validation-schema";
import ServiceGallery from "@/model/ServiceGallery";

// Service gallery Sorting
export const PUT = asyncHandler(
  sortSchema,
  async (req, data) => {
    const { sortedIds } = data;

    const bulkOps = sortedIds.map((item, index) => ({
      updateOne: {
        filter: { _id: item },
        update: { position: index + 1 },
      },
    }));

    await ServiceGallery.bulkWrite(bulkOps, { ordered: false });

    return apiResponse(
      true,
      200,
      "ServiceGallery has been sorted successfully!",
    );
  },
  true,
);
