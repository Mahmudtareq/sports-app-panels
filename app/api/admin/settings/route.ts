import { asyncHandler } from "@/lib/async-handler";
import { apiResponse, transformCloudinaryPaths } from "@/lib/server.utils";
import Settings from "@/model/Settings";
import { NextRequest } from "next/server";

export const GET = asyncHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const context = searchParams.get("context") || "";

  const allContexts = [
    "general",
    "pageBanner",
    "cloudinary",
    "metadata",
    "termsPolicy",
    "businessHours",
  ];

  if (!allContexts.includes(context)) {
    return apiResponse(false, 400, "Invalid context!");
  }

  const settings = (await Settings.findOne({}).select(context)).toObject();

  // Get folder name for image detection
  let folderName = "";
  if (context === "cloudinary") {
    folderName = settings?.cloudinary?.folder || "";
  } else {
    const cloudinarySettings = (
      await Settings.findOne({}).select("cloudinary")
    ).toObject();
    folderName = cloudinarySettings?.cloudinary?.folder || "";
  }

  // Transform the data to include full Cloudinary URLs
  const transformedData = await transformCloudinaryPaths(
    settings?.[context],
    folderName,
  );

  return apiResponse(
    true,
    200,
    "Settings data has been fetched successfully!",
    transformedData,
  );
});
