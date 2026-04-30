import {
  cloudinarySecureUrlBase,
  getCloudinaryFolderName,
  uploadToCloudinary,
} from "@/config/cloudinary";
import { asyncFormDataHandler } from "@/lib/async-formdata-handler";
import { asyncHandler } from "@/lib/async-handler";
import { fileValidator } from "@/lib/file-validator";
import { apiResponse } from "@/lib/server.utils";
import { createTestimonialValidationSchema } from "@/lib/validation-schema";
import { Testimonial } from "@/model/Testimonial";

//!create
export const POST = asyncFormDataHandler(
  createTestimonialValidationSchema,
  async (req, data, formData: FormData) => {
    const image = formData.get("image") as File;
    const { valid: validImage, error: errorOne } = fileValidator(image, {
      required: true,
    });

    if (!validImage) {
      return apiResponse(false, 400, errorOne || "Image is required!");
    }
    const folderName = await getCloudinaryFolderName();

    //upload image
    const { public_id: imageId } = await uploadToCloudinary(
      formData.get("image") as File,
      {
        folder: `${folderName}/testimonial`,
      },
    );

    const payloadData: Record<string, any> = {
      ...data,
      image: imageId,
    };
    const result = await Testimonial.create(payloadData);
    return apiResponse(true, 201, "Testimonial created successfully!", result);
  },
  true,
);
//!get
export const GET = asyncHandler(async (req) => {
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams);

  const searchTerm = query.search;
  const andConditions: any[] = [];

  if (searchTerm?.trim().length) {
    const searchableFields = ["heading", "subHeading", "quote"];
    andConditions.push({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }
  const CLOUDINARY_SECURE_URL_BASE = await cloudinarySecureUrlBase();

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Testimonial.aggregate([
    {
      $match: whereCondition,
    },
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

  return apiResponse(true, 200, "Testimonail fetched successfully!", result);
}, true);
