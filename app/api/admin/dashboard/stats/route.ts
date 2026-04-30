import { asyncHandler } from "@/lib/async-handler";
import { apiResponse } from "@/lib/server.utils";
import Category from "@/model/Category";
import { Gallery } from "@/model/Gallery";
import { Stories } from "@/model/Stories";
import { Testimonial } from "@/model/Testimonial";

export const GET = asyncHandler(async () => {
  const [stories, gallery, testimonial, category] = await Promise.all([
    Stories.aggregate([
      {
        $facet: {
          featured: [{ $match: { isFeatured: true } }, { $count: "value" }],
          active: [{ $match: { status: true } }, { $count: "value" }],
          inactive: [{ $match: { status: false } }, { $count: "value" }],
          total: [{ $count: "value" }],
        },
      },
      {
        $project: {
          featured: { $ifNull: [{ $arrayElemAt: ["$featured.value", 0] }, 0] },
          active: { $ifNull: [{ $arrayElemAt: ["$active.value", 0] }, 0] },
          inactive: { $ifNull: [{ $arrayElemAt: ["$inactive.value", 0] }, 0] },
          total: { $ifNull: [{ $arrayElemAt: ["$total.value", 0] }, 0] },
        },
      },
    ]),

    Gallery.aggregate([
      {
        $facet: {
          featured: [{ $match: { isFeatured: true } }, { $count: "value" }],
          active: [{ $match: { status: true } }, { $count: "value" }],
          inactive: [{ $match: { status: false } }, { $count: "value" }],
          total: [{ $count: "value" }],
        },
      },
      {
        $project: {
          featured: { $ifNull: [{ $arrayElemAt: ["$featured.value", 0] }, 0] },
          active: { $ifNull: [{ $arrayElemAt: ["$active.value", 0] }, 0] },
          inactive: { $ifNull: [{ $arrayElemAt: ["$inactive.value", 0] }, 0] },
          total: { $ifNull: [{ $arrayElemAt: ["$total.value", 0] }, 0] },
        },
      },
    ]),

    Testimonial.aggregate([
      {
        $facet: {
          active: [{ $match: { status: true } }, { $count: "value" }],
          inactive: [{ $match: { status: false } }, { $count: "value" }],
          total: [{ $count: "value" }],
        },
      },
      {
        $project: {
          active: { $ifNull: [{ $arrayElemAt: ["$active.value", 0] }, 0] },
          inactive: { $ifNull: [{ $arrayElemAt: ["$inactive.value", 0] }, 0] },
          total: { $ifNull: [{ $arrayElemAt: ["$total.value", 0] }, 0] },
        },
      },
    ]),

    Category.aggregate([
      {
        $facet: {
          active: [{ $match: { status: true } }, { $count: "value" }],
          inactive: [{ $match: { status: false } }, { $count: "value" }],
          total: [{ $count: "value" }],
        },
      },
      {
        $project: {
          active: { $ifNull: [{ $arrayElemAt: ["$active.value", 0] }, 0] },
          inactive: { $ifNull: [{ $arrayElemAt: ["$inactive.value", 0] }, 0] },
          total: { $ifNull: [{ $arrayElemAt: ["$total.value", 0] }, 0] },
        },
      },
    ]),
  ]);

  return apiResponse(true, 200, "stats fetched successfully!", {
    story: stories[0],
    gallery: gallery[0],
    testimonial: testimonial[0],
    category: category[0],
  });
}, true);
