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

  const settingsDoc = await Settings.findOne({}).select(context);
  if (!settingsDoc) {
    return apiResponse(true, 200, "Settings data has been fetched successfully!", null);
  }
  const settings = settingsDoc.toObject();

  // Get folder name for image detection
  let folderName = "";
  if (context === "cloudinary") {
    folderName = settings?.cloudinary?.folder || "";
  } else {
    const cloudinaryDoc = await Settings.findOne({}).select("cloudinary");
    folderName = cloudinaryDoc?.toObject()?.cloudinary?.folder || "";
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
