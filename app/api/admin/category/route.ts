import { asyncHandler } from "@/lib/async-handler";
import pick from "@/lib/pick";
import { apiResponse } from "@/lib/server.utils";
import { createCategorySchema } from "@/lib/validation-schema";
import Category from "@/model/Category";

//category careate
export const POST = asyncHandler(
  createCategorySchema,
  async (req, data) => {
    const mainSlug = data.slug;
    const subSlugs = data.subCategories?.map((s) => s.slug) || [];

    const allSlugs = [mainSlug, ...subSlugs];

    // Detect duplicate slugs in request
    const uniqueSlugs = new Set(allSlugs);
    if (uniqueSlugs.size !== allSlugs.length) {
      return apiResponse(false, 400, "Duplicate slug(s) found in request!");
    }

    //Check existing slugs in DB (single query)
    const existing = await Category.find(
      { slug: { $in: allSlugs } },
      { slug: 1 },
    ).lean();

    if (existing.length > 0) {
      return apiResponse(
        false,
        400,
        `Slug(s) already exist: ${existing.map((e) => e.slug).join(", ")}`,
      );
    }

    try {
      //Create parent category
      const parent = await Category.create({
        name: data.name,
        slug: mainSlug,
        status: data.status,
        featured: data.featured,
      });

      // Create subcategories
      if (data.subCategories?.length) {
        const subDocs = data.subCategories.map((sub) => ({
          name: sub.name,
          slug: sub.slug,
          status: sub.status,
          parent: parent._id,
        }));

        await Category.insertMany(subDocs, { ordered: true });
      }

      return apiResponse(true, 201, "Category created successfully!");
    } catch (err: any) {
      if (err.code === 11000) {
        return apiResponse(false, 400, "Duplicate slug detected!");
      }
      throw err;
    }
  },
  true,
);

//get all category
export const GET = asyncHandler(async (req) => {
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams);

  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filters = pick(query, ["status", "featured"]);
  const searchTerm = query.search;

  const matchQuery: any = { parent: null };

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value === "true") matchQuery[key] = true;
      else if (value === "false") matchQuery[key] = false;
      else matchQuery[key] = value;
    }
  });
  // Add search filter separately
  if (searchTerm) {
    const searchableFields = ["name", "slug"];
    matchQuery.$or = searchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    }));
  }

  // Sorting
  const sortField = paginationOptions.sortBy || "position";
  const sortOrder = paginationOptions.sortOrder === "desc" ? -1 : 1;

  const data = await Category.aggregate([
    { $match: matchQuery },
    { $sort: { [sortField]: sortOrder } },
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
    "Categories have been fetched successfully!",
    data,
  );
}, true);
