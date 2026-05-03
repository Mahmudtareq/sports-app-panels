import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { createSubscribeSchema } from "@/lib/validation-schema";
import { Subscribe } from "@/model/Subscribe";

export const POST = asyncHandler(createSubscribeSchema, async (req, data) => {
  const result = await Subscribe.create({
    ...data,
  });
  return apiResponse(true, 201, "contact created successfully!", result);
});
