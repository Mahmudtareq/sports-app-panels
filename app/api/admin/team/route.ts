import {
  cloudinarySecureUrlBase,
  getCloudinaryFolderName,
  uploadToCloudinary,
} from "@/config/cloudinary";
import { asyncFormDataHandler } from "@/lib/async-formdata-handler";
import { asyncHandler } from "@/lib/async-handler";
import { fileValidator } from "@/lib/file-validator";
import { apiResponse } from "@/lib/server.utils";
import { createTeamSchema } from "@/lib/validation-schema";
import { Team } from "@/model/Team";

export const POST = asyncFormDataHandler(
  createTeamSchema,
  async (req, data, formData: FormData) => {
    const image = formData.get("image") as File;
    const { valid: validImage, error: errorOne } = fileValidator(image, {
      required: true,
    });

    if (!validImage) {
      return apiResponse(false, 400, errorOne || "Image is required!");
    }
    const folderName = await getCloudinaryFolderName();

    const { public_id: imageId } = await uploadToCloudinary(
      formData.get("image") as File,
      {
        folder: `${folderName}/team`,
      },
    );

    const payloadData: Record<string, any> = {
      ...data,
      image: imageId,
    };
    const result = await Team.create(payloadData);
    return apiResponse(true, 201, "Team created successfully", result);
  },
  true,
);
export const GET = asyncHandler(async (req, params) => {
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const result = await Team.aggregate([
    {
      $addFields: {
        image: {
          $concat: [CLOUDINARY_SECURE_URL_BASE, "/", "$image"],
        },
      },
    },
    {
      $sort: {
        order: 1,
      },
    },
  ]);
  return apiResponse(true, 200, "Team fetch successfully", result);
}, true);
