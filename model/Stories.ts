import { Document, model, models, Schema, Types } from "mongoose";

export interface IStories extends Document {
  image?: string;
  photos?: string[];
  title: string;
  slug: string;
  description?: string;
  client: string;
  photographer: string;
  mood: string;
  camera?: string;
  shutterSpeed?: string;
  lensUsed?: string;
  focus?: string[];
  approach?: string[];
  eventDate?: Date;
  isFeatured: boolean;
  category: Types.ObjectId[];
  status: boolean;
}

const StoriesSchema = new Schema<IStories>(
  {
    title: { type: String, required: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },

    photos: [String],

    client: { type: String, required: true },

    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],

    photographer: { type: String, required: true },

    mood: { type: String, required: true },

    camera: { type: String },
    shutterSpeed: {
      type: String,
    },
    lensUsed: { type: String },

    focus: { type: [String] },
    approach: { type: [String] },

    isFeatured: { type: Boolean, default: false },
    status: { type: Boolean, default: true },

    eventDate: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

export const Stories =
  models.Stories || model<IStories>("Stories", StoriesSchema, "stories");
