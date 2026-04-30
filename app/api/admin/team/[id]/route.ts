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
import { updateTeamSchema } from "@/lib/validation-schema";
import { Team } from "@/model/Team";
import { Types } from "mongoose";

//! single team
export const GET = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing gallery id!");
  }
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const [result] = await Team.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },
    {
      $addFields: {
        image: {
          $concat: [CLOUDINARY_SECURE_URL_BASE, "/", "$image"],
        },
      },
    },
  ]);
  if (!result) {
    return apiResponse(false, 404, "Team not found!");
  }
  return apiResponse(true, 200, "Team fetched successfully!", result);
}, true);

//! update team
export const PUT = asyncFormDataHandler(
  updateTeamSchema,
  async (req, data, formData: FormData, params) => {
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return apiResponse(false, 400, "Invalid banner id");
    }
    //! check existing
    const existingTeam = await Team.findById(id).lean();
    let imagePublicId = existingTeam.image;
    const image = formData.get("image") as File | null;
    if (image) {
      const { valid, error } = fileValidator(image);
      if (!valid) return apiResponse(false, 400, error!);

      const folderName = await getCloudinaryFolderName();

      //! upload image
      const { public_id } = await uploadToCloudinary(image, {
        folder: `${folderName}/team`,
      });

      imagePublicId = public_id;
      if (existingTeam.image) {
        await deleteFromCloudinary(existingTeam.image);
      }
    }

    const updateData = {
      ...data,
      image: imagePublicId,
    };

    const result = await Team.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return apiResponse(
      true,
      200,
      "Team has been updated successfully!",
      result,
    );
  },
  true,
);

//!delete
export const DELETE = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing team id!");
  }
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();
  const existingData = await Team.findById(id);
  if (!existingData) {
    return apiResponse(false, 404, "Team not found!");
  }
  if (existingData.image) {
    try {
      const key = existingData.image.startsWith("http")
        ? existingData.image.replace(`${CLOUDINARY_SECURE_URL_BASE}/`, "")
        : existingData.image;
      await deleteFromCloudinary(key);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }
  }

  await Team.findByIdAndDelete(id);
  return apiResponse(true, 200, "Team deleted successfully!");
}, true);
