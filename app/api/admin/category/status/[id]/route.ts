import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { statusSchema } from "@/lib/validation-schema";
import Category from "@/model/Category";

export const PUT = asyncHandler(
  statusSchema,
  async (req, data, params) => {
    const { id } = params;

    const category = await Category.findById(id);
    if (!category) return apiResponse(false, 404, "Category not found!");

    await Category.findByIdAndUpdate(id, data);

    return apiResponse(
      true,
      200,
      "Category status has been updated successfully!",
    );
  },
  true,
);
