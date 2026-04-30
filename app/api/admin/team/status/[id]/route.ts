import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { updateStoryStatus } from "@/lib/validation-schema";
import { Team } from "@/model/Team";
import { Types } from "mongoose";

export const PUT = asyncHandler(
  updateStoryStatus,
  async (req, data, params) => {
    const { id } = params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return apiResponse(false, 400, "Invalid or missing Team id!");
    }

    const existingTeam = await Team.findById(id).lean();
    if (!existingTeam) {
      return apiResponse(false, 404, "Team not found!");
    }
    const result = await Team.findByIdAndUpdate(
      id,
      { ...data },
      {
        new: true,
      },
    );

    return apiResponse(
      true,
      200,
      "Team status has been updated successfully!",
      result,
    );
  },
  true,
);
