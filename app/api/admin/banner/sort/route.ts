import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { sortSchema } from "@/lib/validation-schema";
import Banner from "@/model/Banner";

// Banner Sorting
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

    await Banner.bulkWrite(bulkOps, { ordered: false });

    return apiResponse(true, 200, "Banner has been sorted successfully!");
  },
  true,
);
