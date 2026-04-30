import { cloudinarySecureUrlBase } from "@/config/cloudinary";
import { asyncHandler } from "@/lib/async-handler";
import { LookupConfig, mongoAdapter } from "@/lib/mongo-adapter";
import { apiResponse } from "@/lib/server.utils";
import HomeSection, { IHomeSection } from "@/model/HomeSection";

export const GET = asyncHandler(async (req, params) => {
  const { slug } = params;
  const BASE_URL = await cloudinarySecureUrlBase();

  let projectFields: Record<string, number> = {
    sectionKey: 1,
    title: 1,
    subTitle: 1,
  };
  switch (slug) {
    // case "gallery":
    //   projectFields.gallery = 1;
    //   break;
    case "home-about":
      projectFields.sectionImage = 1;
      projectFields.stats = 1;
      break;
    case "about-us":
      projectFields.sectionImage = 1;
      projectFields.stats = 1;
      break;
    case "why-choose-momento":
      projectFields.features = 1;

      break;
  }
  const lookups: LookupConfig[] = [];

  //!conditional joining
  if (slug == "gallery") {
    lookups.push({
      from: "galleries",
      localField: "serviceIds",
      foreignField: "_id",
      as: "gallery",
      pipeline: [
        {
          $addFields: {
            image: {
              $concat: [BASE_URL, "/", "$image"],
            },
          },
        },
      ],
    });
  }
  if (slug == "story") {
    lookups.push({
      from: "stories",
      localField: "serviceIds",
      foreignField: "_id",
      as: "story",
      pipeline: [
        {
          $addFields: {
            image: {
              $concat: [BASE_URL, "/", "$image"],
            },
          },
        },
      ],
    });
  }

  const [result] = await mongoAdapter.aggregateWithPagination<IHomeSection>(
    HomeSection,
    {
      match: { sectionKey: slug, status: true },
      lookups: lookups,
      project: {
        ...projectFields,
      },
      extraStages: [
        {
          $addFields: {
            sectionImage: {
              $concat: [BASE_URL, "/", "$sectionImage"],
            },
          },
        },
      ],
      skipPagination: true,
      // extra,
    },
  );
  return apiResponse(true, 200, "Fetch Home Section successfully", result);
});
