import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { updateStoryStatus } from "@/lib/validation-schema";
import { Stories } from "@/model/Stories";
import { Types } from "mongoose";

export const PUT = asyncHandler(
  updateStoryStatus,
  async (req, data, params) => {
    const { id } = params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return apiResponse(false, 400, "Invalid or missing story id!");
    }

    const existingStory = await Stories.findById(id).lean();
    if (!existingStory) {
      return apiResponse(false, 404, "Stories not found!");
    }
    const result = await Stories.findByIdAndUpdate(
      id,
      { ...data },
      {
        new: true,
      },
    );

    return apiResponse(
      true,
      200,
      "Story status has been updated successfully!",
      result,
    );
  },
  true,
);
