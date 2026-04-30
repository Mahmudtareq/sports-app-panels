import {
  cloudinarySecureUrlBase,
  deleteFromCloudinary,
  getCloudinaryFolderName,
  uploadToCloudinary,
} from "@/config/cloudinary";
import { asyncFormDataHandler } from "@/lib/async-formdata-handler";
import { asyncHandler } from "@/lib/async-handler";
import { fileValidator } from "@/lib/file-validator";
import { apiResponse } from "@/lib/server.utils";
import Settings from "@/model/Settings";
import { NextRequest } from "next/server";

export const PUT = asyncFormDataHandler(
  null,
  async (req: NextRequest, _, formData: FormData) => {
    const imageFields = ["menu", "outlets", "blogs"] as const;
    const uploadedImages: Record<string, string> = {};

    // Fetch existing showcase data
    const { pageBanner } = (await Settings.findOne({})) || {};

    for (const field of imageFields) {
      const file = formData.get(field);

      if (file) {
        const { valid, error } = fileValidator(file as File, {
          required: false,
        });
        if (!valid) return apiResponse(false, 400, error!);

        // Delete existing image from Cloudinary if it exists
        if (pageBanner?.[field]) {
          await deleteFromCloudinary(pageBanner[field]);
        }
        const folderName = await getCloudinaryFolderName();

        // Upload new image to Cloudinary
        const { public_id } = await uploadToCloudinary(file as File, {
          folder: `${folderName}/settings`,
        });

        uploadedImages[field] = public_id;
      }
    }

    // Build $set object with only the fields being updated
    const updateFields = Object.entries({ ...uploadedImages }).reduce(
      (acc, [key, value]) => {
        acc[`pageBanner.${key}`] = value;
        return acc;
      },
      {} as Record<string, any>,
    );

    await Settings.findOneAndUpdate(
      {},
      { $set: updateFields },
      { upsert: true },
    );

    return apiResponse(
      true,
      200,
      "Page Banner settings has been updated successfully!",
    );
  },
  true,
);

export const GET = asyncHandler(async () => {
  const { pageBanner } = (await Settings.findOne({})) || {};

  if (!pageBanner) {
    return apiResponse(false, 404, "Page Banner settings not found!");
  }

  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const data = {
    menu: pageBanner?.menu
      ? `${CLOUDINARY_SECURE_URL_BASE}/${pageBanner?.menu}`
      : null,
    outlets: pageBanner?.outlets
      ? `${CLOUDINARY_SECURE_URL_BASE}/${pageBanner?.outlets}`
      : null,
    blogs: pageBanner?.blogs
      ? `${CLOUDINARY_SECURE_URL_BASE}/${pageBanner?.blogs}`
      : null,
  };

  return apiResponse(
    true,
    200,
    "Page banner settings has been fetched successfully!",
    data,
  );
}, true);
