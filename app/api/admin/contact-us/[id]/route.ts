import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { updateContactusSchema } from "@/lib/validation-schema";
import { Contactus } from "@/model/ContactUs";
import { Types } from "mongoose";

//!update
export const PUT = asyncHandler(
  updateContactusSchema,
  async (req, data, params) => {
    const { id } = params;

    if (!id || Types.ObjectId.isValid(id) === false) {
      return apiResponse(false, 400, "Invalid or missing testimonial id!");
    }
    const result = await Contactus.findByIdAndUpdate(id, data, {
      new: true,
    });

    return apiResponse(true, 200, "Contact Us updated successfully!");
  },
  true,
);

//!single

export const GET = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing Contactus id!");
  }

  const [data] = await Contactus.aggregate([
    {
      $match: { _id: new Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
  ]);
  if (!data) {
    return apiResponse(false, 404, "Contactus not found!");
  }
  return apiResponse(true, 200, "Contactus fetched successfully!", data);
}, true);

//!delete
export const DELETE = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing Contactus id!");
  }

  const existingTestimonail = await Contactus.findById(id);
  if (!existingTestimonail) {
    return apiResponse(false, 404, "Contactus not found!");
  }

  await Contactus.findByIdAndDelete(id);
  return apiResponse(true, 200, "Testimonial deleted successfully!");
}, true);
