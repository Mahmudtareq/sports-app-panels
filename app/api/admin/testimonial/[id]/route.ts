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
import { updateTestimonialValidationSchema } from "@/lib/validation-schema";
import { Testimonial } from "@/model/Testimonial";
import { Types } from "mongoose";

//!update
export const PUT = asyncFormDataHandler(
  updateTestimonialValidationSchema,
  async (req, data, formData: FormData, params) => {
    const { id } = params;
    if (!id || Types.ObjectId.isValid(id) === false) {
      return apiResponse(false, 400, "Invalid or missing testimonial id!");
    }

    const existingTestimonial = await Testimonial.findById(id).lean();
    if (!existingTestimonial) {
      return apiResponse(false, 404, "Testimonial not found!");
    }

    let image = existingTestimonial.image;

    const newImage = formData.get("image") as File;
    if (newImage) {
      const { valid, error } = fileValidator(newImage, { required: true });
      if (!valid) {
        return apiResponse(false, 400, error || "Invalid  image!");
      }
      const folderName = await getCloudinaryFolderName();

      const uploadResult = await uploadToCloudinary(newImage, {
        folder: `${folderName}/testimonial`,
      });

      image = uploadResult.public_id;
    }

    const payloadData: Record<string, any> = {
      ...data,
      image: image,
    };

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      payloadData,
      { new: true },
    );

    return apiResponse(
      true,
      200,
      "Testimonial updated successfully!",
      updatedTestimonial,
    );
  },
  true,
);

//! single
export const GET = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing testimonial id!");
  }
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const [data] = await Testimonial.aggregate([
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
  if (!data) {
    return apiResponse(false, 404, "Testimonial not found!");
  }
  return apiResponse(true, 200, "Testimonial fetched successfully!", data);
}, true);

//! delete
export const DELETE = asyncHandler(async (req, params) => {
  const { id } = params;
  if (!id || !Types.ObjectId.isValid(id)) {
    return apiResponse(false, 400, "Invalid or missing testimonial id!");
  }

  const existingTestimonail = await Testimonial.findById(id).lean();
  if (!existingTestimonail) {
    return apiResponse(false, 404, "Testimonial not found!");
  }
  if (existingTestimonail.image) {
    try {
      await deleteFromCloudinary(existingTestimonail.image);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }
  }

  await Testimonial.findByIdAndDelete(id);
  return apiResponse(true, 200, "Testimonial deleted successfully!");
}, true);
