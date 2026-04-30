import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { sortSchema } from "@/lib/validation-schema";
import { Gallery } from "@/model/Gallery";

export const PUT = asyncHandler(
  sortSchema,
  async (req, data) => {
    const { sortedIds } = data;

    const bulkOps = sortedIds.map((item, index) => ({
      updateOne: {
        filter: { _id: item },
        update: { orderBy: index + 1 },
      },
    }));

    await Gallery.bulkWrite(bulkOps, { ordered: false });

    return apiResponse(true, 200, "Gallery has been sorted successfully!");
  },
  true,
);
