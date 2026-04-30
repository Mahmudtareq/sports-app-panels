import { Document, model, models, Schema } from "mongoose";

export interface IGallery extends Document {
  image: string;
  title: string;
  status: boolean;
  isFeature: boolean;
  category: string;
  orderBy: number;
  author: string;
}
interface GalleryJSON {
  image?: string;
  [key: string]: unknown;
}
const GallerySchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    orderBy: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Gallery =
  models.Gallery || model<IGallery>("Gallery", GallerySchema, "galleries");
