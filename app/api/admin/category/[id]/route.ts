import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import { categoryUpdateSchema } from "@/lib/validation-schema";
import Category from "@/model/Category";
import { Stories } from "@/model/Stories";
import { Types } from "mongoose";

//update category
export const PUT = asyncHandler(
  categoryUpdateSchema,
  async (req, data, params) => {
    const { id } = params;
    const { subCategories = [], ...categoryData } = data;
    const categoryExists = await Category.findById(id);
    if (!categoryExists) return apiResponse(false, 404, "Category not found!");
    if (categoryData.slug && categoryData.slug !== categoryExists.slug) {
      const slugExists = await Category.findOne({ slug: categoryData.slug });
      if (slugExists) return apiResponse(false, 400, "Slug already in use!");
    }
    Object.assign(categoryExists, categoryData);
    await categoryExists.save();
    const subCategoriesList = subCategories || [];
    // Handle subCategories
    for (const subCat of subCategoriesList) {
      if (subCat._id) {
        // Existing subcategory
        if (subCat._delete) {
          // Delete
          await Category.findByIdAndDelete(subCat._id);
        } else {
          // Validate slug uniqueness for subcategory
          if (subCat.slug) {
            const slugExists = await Category.findOne({
              slug: subCat.slug,
              _id: { $ne: subCat._id },
            });
            if (slugExists)
              return apiResponse(
                false,
                400,
                `Slug '${subCat.slug}' already in use!`,
              );
          }
          // Update
          await Category.findByIdAndUpdate(subCat._id, subCat, { new: true });
        }
      } else {
        // Validate slug uniqueness for new subcategory
        if (subCat.slug) {
          const slugExists = await Category.findOne({ slug: subCat.slug });
          if (slugExists)
            return apiResponse(
              false,
              400,
              `Slug '${subCat.slug}' already in use!`,
            );
        }
        // Create new subcategory
        const newSub = new Category({
          ...subCat,
          parent: categoryExists._id,
        });
        await newSub.save();
      }
    }

    // Fetch updated category with subcategories
    const updatedCategory = await Category.aggregate([
      { $match: { _id: categoryExists._id } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parent",
          as: "subCategories",
          pipeline: [{ $sort: { position: 1 } }],
        },
      },
    ]);

    return apiResponse(
      true,
      200,
      "Category updated successfully!",
      updatedCategory[0],
    );
  },
);

export const DELETE = asyncHandler(async (req, params) => {
  const { id } = params;

  const category = await Category.findById(id);
  if (!category) return apiResponse(false, 404, "Category not found!");

  await Promise.all([
    Category.deleteMany({
      $or: [{ _id: category._id }, { parent: category._id }],
    }),

    Stories.updateMany(
      { category: category._id },
      { $pull: { category: category._id } },
    ),
  ]);

  // delete stories with no category
  await Stories.deleteMany({
    category: { $size: 0 },
  });

  return apiResponse(true, 200, "Category deleted successfully!");
}, true);

// Get a category
export const GET = asyncHandler(async (req, params) => {
  const { id } = params;

  const [category] = await Category.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
        parent: null,
      },
    },
    {
      $sort: {
        position: 1,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parent",
        as: "subCategories",
        pipeline: [
          {
            $sort: { position: 1 },
          },
        ],
      },
    },
  ]);

  if (!category) return apiResponse(false, 404, "Category not found!");

  return apiResponse(
    true,
    200,
    "Single category has been fetched successfully!",
    category,
  );
}, true);
