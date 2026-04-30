import {
  deleteFromCloudinary,
  getCloudinaryFolderName,
  uploadToCloudinary,
} from "@/config/cloudinary";
import { asyncFormDataHandler } from "@/lib/async-formdata-handler";
import { asyncHandler } from "@/lib/async-handler";
import { fileValidator } from "@/lib/file-validator";
import { apiResponse } from "@/lib/server.utils";
import { deleteImageSchema } from "@/lib/validation-schema";
type DeleteImagePayload = {
  imageId?: string;
  imageIds?: string[];
};
export const POST = asyncFormDataHandler(
  null,
  async (req, dataTableSchema, formData: FormData) => {
    const files: File[] = [];
    const image = formData.get("image") as File;
    if (image instanceof File) {
      files.push(image);
    }
    const multiple = formData.getAll("images");
    for (const file of multiple) {
      if (file instanceof File) {
        files.push(file);
      }
    }

    if (files.length === 0) {
      return apiResponse(false, 400, "Image is required");
    }
    for (const file of files) {
      const { valid, error } = fileValidator(file, {
        required: true,
      });

      if (!valid) {
        return apiResponse(false, 400, error || "Invalid image");
      }
    }
    const uploadedImages = [];
    const folderName = await getCloudinaryFolderName();

    for (const file of files) {
      const uploaded = await uploadToCloudinary(file, {
        folder: `${folderName}/product`,
      });

      uploadedImages.push({
        imageId: uploaded.public_id,
        url: uploaded.secure_url,
      });
    }
    return apiResponse(true, 201, "Image uploaded successfully", {
      single: uploadedImages.length === 1 ? uploadedImages[0] : null,
      multiple: uploadedImages.length > 1 ? uploadedImages : null,
      all: uploadedImages,
    });
  },
);

export const DELETE = asyncHandler<DeleteImagePayload>(
  deleteImageSchema,
  async (req, data) => {
    const imageIds: string[] = [];

    // single
    if (typeof data?.imageId === "string") {
      imageIds.push(data.imageId);
    }

    // multiple
    if (Array.isArray(data?.imageIds)) {
      imageIds.push(...data.imageIds);
    }

    // validation
    if (imageIds.length === 0) {
      return apiResponse(false, 400, "imageId or imageIds is required");
    }

    const results: {
      imageId: string;
      deleted: boolean;
      error?: string;
    }[] = [];

    for (const id of imageIds) {
      try {
        await deleteFromCloudinary(id);

        results.push({
          imageId: id,
          deleted: true,
        });
      } catch (err) {
        results.push({
          imageId: id,
          deleted: false,
          error: "Failed to delete image",
        });
      }
    }

    return apiResponse(true, 200, "Image delete processed", {
      results,
    });
  },
);
