import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { Subscribe } from "@/model/Subscribe";

export const GET = asyncHandler(async (req) => {
  const [subscribe] = await Promise.all([
    Subscribe.aggregate([
      {
        $facet: {
          total: [{ $count: "value" }],
          active: [
            {
              $match: { status: true },
            },
            {
              $count: "value",
            },
          ],
          inactive: [
            {
              $match: {
                status: false,
              },
            },
            {
              $count: "value",
            },
          ],
        },
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ["$total.value", 0] }, 0] },
          active: { $ifNull: [{ $arrayElemAt: ["$active.value", 0] }, 0] },
          inactive: { $ifNull: [{ $arrayElemAt: ["$inactive.value", 0] }, 0] },
        },
      },
    ]),
  ]);
  return apiResponse(true, 200, "stats fetched successfully!", {
    subscribe: subscribe[0],
  });
}, true);
