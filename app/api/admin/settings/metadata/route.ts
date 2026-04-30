import {
  cloudinarySecureUrlBase,
  getCloudinaryFolderName,
  uploadToCloudinary,
} from "@/config/cloudinary";
import { asyncFormDataHandler } from "@/lib/async-formdata-handler";
import { asyncHandler } from "@/lib/async-handler";
import { fileValidator } from "@/lib/file-validator";
import { apiResponse } from "@/lib/server.utils";
import { metadataSchema } from "@/lib/validation-schema";
import Settings from "@/model/Settings";
import { NextRequest } from "next/server";
import z from "zod";

export const PUT = asyncFormDataHandler(
  metadataSchema,
  async (
    req: NextRequest,
    data: z.infer<typeof metadataSchema>,
    formData: FormData,
  ) => {
    const { metadata } = (await Settings.findOne({})) || {};
    let openGraphImage = metadata?.openGraphImage;

    // Fetch existing showcase data
    const { valid, error } = fileValidator(
      formData.get("openGraphImage") as File,
      {
        required: false,
      },
    );
    if (!valid) return apiResponse(false, 400, error!);

    if (formData.get("openGraphImage")) {
      // Upload to cloudinary
      const folderName = await getCloudinaryFolderName();

      const { public_id } = await uploadToCloudinary(
        formData.get("openGraphImage") as File,
        {
          folder: `${folderName}/settings`,
        },
      );

      openGraphImage = public_id;
    }

    // Build $set object with only the fields being updated
    const updateFields = Object.entries({
      ...data,
      openGraphImage,
    }).reduce(
      (acc, [key, value]) => {
        acc[`metadata.${key}`] = value;
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
      "Metadata settings has been updated successfully!",
    );
  },
  true,
);

export const GET = asyncHandler(async () => {
  const { metadata } = (await Settings.findOne({})) || {};

  if (!metadata) {
    return apiResponse(false, 404, "Metadata settings not found!");
  }

  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const data = {
    ...metadata.toObject(),
    openGraphImage: metadata?.openGraphImage
      ? `${CLOUDINARY_SECURE_URL_BASE}/${metadata?.openGraphImage}`
      : null,
  };

  return apiResponse(
    true,
    200,
    "Metadata settings has been fetched successfully!",
    data,
  );
}, true);
