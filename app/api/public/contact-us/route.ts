import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { createContactusSchema } from "@/lib/validation-schema";
import { Contactus } from "@/model/ContactUs";
import { Types } from "mongoose";

export const POST = asyncHandler(createContactusSchema, async (req, data) => {
  const categoryId = new Types.ObjectId(data.category);
  const result = await Contactus.create({
    ...data,
    category: categoryId,
  });
  return apiResponse(true, 201, "contact created successfully!", result);
});
