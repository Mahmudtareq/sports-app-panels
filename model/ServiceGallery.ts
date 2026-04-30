import mongoose, { Document, Schema } from "mongoose";

export interface IServiceGallery extends Document {
  heading: string;
  shortDesc: string;
  image: string;
  position: number;
  status: boolean;
}

interface ServiceGalleryJSON {
  _id?: unknown;
  heading?: string;
  shortDesc?: string;
  image?: string;
  position?: number;
  status?: boolean;
  [key: string]: unknown;
}

const ServiceGallerySchema: Schema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    shortDesc: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    position: { type: Number, required: true, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ServiceGallerySchema.index({ position: 1 });

const ServiceGallery =
  mongoose.models.ServiceGallery ||
  mongoose.model<IServiceGallery>(
    "ServiceGallery",
    ServiceGallerySchema,
    "service_galleries",
  );

export default ServiceGallery;
