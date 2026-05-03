import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { updateSubscribeSchema } from "@/lib/validation-schema";
import { Subscribe } from "@/model/Subscribe";
import { Types } from "mongoose";

//!update
export const PUT = asyncHandler(
  updateSubscribeSchema,
  async (req, data, params) => {
    const { id } = params;

    if (!id || Types.ObjectId.isValid(id) === false) {
      return apiResponse(false, 400, "Invalid or missing subscribe id!");
    }
    const result = await Subscribe.findByIdAndUpdate(id, data, {
      new: true,
    });

    return apiResponse(true, 200, "Subscribe Us updated successfully!");
  },
  true,
);

//!single

export const GET = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing Subscribe id!");
  }

  const [data] = await Subscribe.aggregate([
    {
      $match: { _id: new Types.ObjectId(id) },
    },
  ]);
  if (!data) {
    return apiResponse(false, 404, "Subscribe not found!");
  }
  return apiResponse(true, 200, "Subscribe fetched successfully!", data);
}, true);

//!delete
export const DELETE = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing Subscribe id!");
  }

  const existingTestimonail = await Subscribe.findById(id);
  if (!existingTestimonail) {
    return apiResponse(false, 404, "Subscribe not found!");
  }

  await Subscribe.findByIdAndDelete(id);
  return apiResponse(true, 200, "Subscribe deleted successfully!");
}, true);
