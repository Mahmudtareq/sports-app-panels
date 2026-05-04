import { z } from "zod";
import {
  booleanField,
  numberField,
  optionalObjectIdField,
  optionalStringField,
  optionalStringFieldLowerCase,
  requiredStringField,
  requiredStringFieldLowerCase,
} from "./utils";
// import { Types } from "mongoose";
//-------------------------------api validation schema start-----------------------

//admin auth validation
export const adminLoginSchema = z.object({
  email: z.email("Valid email is required!").min(1, "Required!").trim(),
  password: z.string("Required!").min(1, "Required!"),
});

//admin profile
export const adminProfileSchema = z.object({
  name: z.string().trim().nullable(),
});
//admin pass change
export const passwordChangeSchema = z
  .object({
    oldPassword: z.string("Required").min(1, "Required!"),
    newPassword: z
      .string("Required")
      .min(6, "Password must be at least 6 characters long!"),
    confirmPassword: z.string("Required").min(1, "Required!"),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });
//settings validation
export const cloudinarySchema = z.object({
  cloudName: optionalStringField("cloudName"),
  apiKey: optionalStringField("apiKey"),
  apiSecret: optionalStringField("apiSecret"),
  folder: optionalStringField("folder"),
  secureUrlBase: optionalStringField("secureUrlBase"),
});
export const settingsGeneralSchema = z.object({
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  supportEmail: z.string().email().optional(),
  ownerName: z.string().optional(),
  ownerEmail: z.string().email().optional(),

  webviewUrl: z.string().optional(),
  webhookUrl: z.string().optional(),

  manual_flow_enabled: z.boolean().optional(),
  web_view_enabled: z.boolean().optional(),
});
export const metadataSchema = z.object({
  title: optionalStringField("title"),
  applicationName: optionalStringField("applicationName"),
  description: optionalStringField("description"),
  keywords: z
    .array(optionalStringField("keywords"))
    .min(1, "At least one keyword is required!"),
});
export const termsSchema = z.object({
  terms: optionalStringField("terms"),
  policy: optionalStringField("policy"),
});
//!banner validation schema
export const bannerSchema = z.object({
  sectionName: requiredStringField("sectionName"),
  heading: requiredStringField("heading"),
  shortDesc: requiredStringField("shortDesc"),
  categories: z.string(),
  position: numberField("position", 0),

  status: booleanField("status", true),
});

//! global validation for sort & status
export const sortSchema = z.object({
  sortedIds: z.array(z.string()).min(1, "Required!"),
});
export const statusSchema = z.object({
  status: z.coerce.boolean("Value must be boolean!"),
});

//!gallery validation schema
export const createGallerySchema = z.object({
  title: z.string(),
  author: z.string(),
  category: z.string(),
  orderBy: numberField("position", 0),
  status: booleanField("status", true),
  isFeatured: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});
export const updateGallerySchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  orderBy: numberField("position", 0),
  category: z.string().optional(),
  status: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
  isFeatured: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});
export const updateGalleryStatus = z.object({
  status: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    return Number(val);
  }, z.number().optional()),
  isFeatured: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});

//! stories validation schema
export const dateFromForm = z.preprocess((v) => {
  if (v === "" || v === undefined) return undefined;
  const d = new Date(v as string);
  return isNaN(d.getTime()) ? undefined : d;
}, z.date());
// export const createStorySchema = z.object({
//   title: z.string(),
//   slug: z.string(),
//   description: z.string().optional(),
//   category: z.string().optional(),
//   image: z.string().optional(),
//   client: z.string(),
//   photographer: z.string(),
//   isFeatured: z
//     .preprocess((val) => {
//       if (val === "true") return true;
//       if (val === "false") return false;
//       return val;
//     }, z.boolean())
//     .optional(),
//   status: z
//     .preprocess((val) => {
//       if (val === "true") return true;
//       if (val === "false") return false;
//       return val;
//     }, z.boolean())
//     .optional(),
//   eventDate: dateFromForm.optional(),
// });
// const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
//   message: "Invalid ObjectId",
// });
export const createStorySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  slug: z.string(),

  description: z.string().optional(),

  image: z.string().optional(),

  photos: z.array(z.string()),

  client: z.string().min(2, "Client name is required"),

  photographer: z.string().min(2, "Photographer name is required"),

  mood: z.string().min(2, "Mood is required"),

  camera: z.string().optional(),
  shutterSpeed: z.string().optional(),
  lensUsed: z.string().optional(),

  focus: z.array(z.string()).optional(),
  approach: z.array(z.string()).optional(),

  category: z.array(z.string()).min(1, "At least one category is required"),

  eventDate: z.string().datetime().optional(),

  isFeatured: z.boolean().optional(),
  status: z.boolean().optional(),
});
export const updateStorySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),

  slug: z.string().optional(),

  description: z.string().optional(),

  image: z.string().optional(),

  photos: z.array(z.string()).optional(),

  client: z.string().optional(),

  photographer: z.string().optional(),

  mood: z.string().optional(),

  camera: z.string().optional(),
  shutterSpeed: z.string().optional(),
  lensUsed: z.string().optional(),

  focus: z.array(z.string()).optional(),
  approach: z.array(z.string()).optional(),

  category: z.array(z.string()).optional(),

  eventDate: z.string().datetime().optional(),

  isFeatured: z.boolean().optional(),
  status: z.boolean().optional(),
});
export const updateStoryStatus = z.object({
  isFeatured: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
  status: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});

//! testimonial validation schema
export const createTestimonialValidationSchema = z.object({
  // heading: z
  //   .string()
  //   .min(2, "Heading must be at least 2 characters")
  //   .max(1000, "Heading can't exceed 1000 characters"),

  // subHeading: z
  //   .string()
  //   .min(2, "Sub Heading must be at least 2 characters")
  //   .max(1000, "Sub Heading can't exceed 1000 characters"),
  quote: z
    .string()
    .min(5, "Quote must be at least 2 characters")
    .max(1000, "Quote can't exceed 1000 characters"),
  authorName: z
    .string()
    .min(2, "AuthorName must be at least 2 characters")
    .max(100, "AuthorName can't exceed 100 characters"),
  authorRole: z
    .string()
    .min(2, "Author Role must be at least 2 characters")
    .max(100, "Author Role can't exceed 100 characters"),
  order: z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val);
    return val;
  }, z.number().optional()),
  // Preprocess string to boolean
  status: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});

export const updateTestimonialValidationSchema = z.object({
  // heading: z
  //   .string()
  //   .min(2, "Heading must be at least 2 characters")
  //   .max(1000, "Heading can't exceed 1000 characters"),

  // subHeading: z
  //   .string()
  //   .min(2, "Sub Heading must be at least 2 characters")
  //   .max(1000, "Sub Heading can't exceed 1000 characters"),
  quote: z
    .string()
    .min(5, "Quote must be at least 2 characters")
    .max(1000, "Quote can't exceed 1000 characters")
    .optional(),
  authorName: z
    .string()
    .min(2, "AuthorName must be at least 2 characters")
    .max(100, "AuthorName can't exceed 100 characters")
    .optional(),
  authorRole: z
    .string()
    .min(2, "Author Role must be at least 2 characters")
    .max(100, "Author Role can't exceed 100 characters")
    .optional(),
  order: z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val);
    return val;
  }, z.number().optional()),
  // Preprocess string to boolean
  status: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});

//!subscribe validation schema
export const createSubscribeSchema = z.object({
  phone: z.string().optional(),
  category: z.string().optional(),

  status: z.boolean().optional(), // default mongoose handle করবে
});
export const updateSubscribeSchema = z.object({
  phone: z.string().optional(),
  status: z.boolean().optional(),
});

//home page validation schema
export const FeatureSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});
export const StatSchema = z.object({
  value: z.string(),
  suffix: z.string().optional().default("+"),
  label: z.string(),
});
export const HomeSectionSchema = z.object({
  sectionKey: z.string(),
  // z.enum(HOME_SECTION_KEY),
  title: z.string().optional(),
  subTitle: z.string().optional(),
  sectionImage: z.string().optional(),
  orderBy: z.number().optional().default(0),
  status: z.boolean().optional().default(true),

  images: z.array(z.string()).optional().default([]),
  videos: z.array(z.string()).optional().default([]),
  features: z.array(FeatureSchema).optional().default([]),
  stats: z.array(StatSchema).optional().default([]),

  serviceIds: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .optional()
    .default([]),

  content: z.record(z.string(), z.any()).optional().default({}),
  parentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .nullable()
    .optional(),
  sectionType: z
    .enum(["content", "mixed", "gallery", "story"])
    .optional()
    .default("content"),
});

//! service gallery
export const createServiceGallerySchema = z.object({
  heading: z
    .string({ error: "Heading is required" })
    .min(3, "Heading must be at least 3 characters")
    .max(100, "Heading must be at most 100 characters"),
  shortDesc: z
    .string({ error: "Short description is required" })
    .min(5, "Short description must be at least 5 characters")
    .max(300, "Short description must be at most 300 characters"),
  position: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0)), // Form data comes as string
  status: z
    .string()
    .optional()
    .transform((val) => (val === "true" ? true : false)),
});

//! team validation schema
export const createTeamSchema = z.object({
  name: z.string(),
  designation: z.string(),
  status: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});
export const updateTeamSchema = z.object({
  name: z.string().optional(),
  designation: z.string().optional(),
  status: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});

//category validation schema
export const createCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Category Name Must be at least 2 characters!")
      .max(100, "Category Name Must be less then 100 characters!"),
    slug: z.string().trim().optional(),
    parent: z.string().optional().nullable(),

    position: z
      .number()
      .int("Position must be an integer")
      .min(0, "Position cannot be negative")
      .optional(),

    featured: z.boolean().optional(),

    status: z.boolean().optional(),

    subCategories: z
      .array(
        z.object({
          name: requiredStringField("name"),
          slug: requiredStringFieldLowerCase("slug"),
          status: booleanField("status"),
        }),
      )
      .optional()
      .nullable()
      .default([]),
  })
  .strict();
export const categoryUpdateSchema = z.object({
  name: optionalStringField("name"),
  slug: optionalStringFieldLowerCase("slug"),
  status: booleanField("status"),
  featured: booleanField("featured"),
  position: z.number().int().optional(),
  parent: z.union([optionalObjectIdField("parent"), z.null()]).optional(),
  subCategories: z
    .array(
      z.object({
        _id: optionalObjectIdField("_id"), // if exists = UPDATE, if not = CREATE
        name: optionalStringField("name"),
        slug: optionalStringFieldLowerCase("slug"),
        status: booleanField("status"),
        featured: booleanField("featured"),
        position: z.number().int().optional(),
        parent: z.union([optionalObjectIdField("parent"), z.null()]).optional(),
        _delete: booleanField("_delete", false), // flag for deletion
      }),
    )
    .optional()
    .nullable()
    .default([]),
});
//!file uploader validation
export const deleteImageSchema = z.object({
  imageId: z.string().optional(),
  imageIds: z.array(z.string()).optional(),
});
