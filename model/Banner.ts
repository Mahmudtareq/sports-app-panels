import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  heading: string;
  shortDesc: string;
  image: string;
  position: number;
  status: boolean;
  categories?: string;
  sectionName: string;
}
interface BannerJSON {
  _id?: unknown;
  heading?: string;
  shortDesc?: string;
  image?: string;
  position?: number;
  categories?: string;
  status?: boolean;
  [key: string]: unknown;
}

const BannerSchema: Schema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    shortDesc: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    sectionName: {
      type: String,
      enum: ["banner", "section"],
      default: "banner",
    },

    categories: {
      type: String,
      // enum: ["portrait", "wedding", "travel", "event", "lifestyle"],
    },
    position: { type: Number, required: true, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
BannerSchema.index({ position: 1 });

const Banner =
  mongoose.models.Banner ||
  mongoose.model<IBanner>("Banner", BannerSchema, "banners");

export default Banner;
