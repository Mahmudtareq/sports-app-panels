import mongoose, { Schema } from "mongoose";

interface IFeature {
  title?: string;
  description?: string;
}
interface IStat {
  value: string;
  suffix?: string; // "+", "%",
  label: string;
}

export enum HOME_SECTION_KEY {
  GALLERY = "gallery",
  WHAT_WE_OFFER = "about-us",
  SERVICES = "our-services",
  HOMEABOUT = "home-about",
}
export interface IHomeSection {
  sectionKey: string;
  title: string;
  orderBy: number;
  subTitle: string;
  sectionImage: string;
  images: string[];
  videos: string[];
  features: IFeature[];
  stats: IStat[];
  sectionType: "content" | "mixed" | "gallery" | "story";

  serviceIds?: mongoose.Types.ObjectId[];
  status: boolean;
  parentId?: mongoose.Types.ObjectId | null;
  content: {
    [key: string]: any;
  };
}

const FeatureSchema = new Schema<IFeature>(
  {
    title: { type: String, required: false },
    description: { type: String, required: false },
  },
  { _id: false },
);

const StatSchema = new Schema<IStat>(
  {
    value: { type: String, required: false },
    suffix: { type: String, default: "+" },
    label: { type: String, required: false },
  },
  { _id: false },
);
const HomeSectionSchema = new Schema<IHomeSection>(
  {
    sectionKey: { type: String, required: true, unique: true },
    orderBy: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    sectionImage: { type: String },
    title: { type: String, required: false, trim: true },
    subTitle: { type: String, required: false },

    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    features: { type: [FeatureSchema], default: [] },
    stats: { type: [StatSchema], default: [] },
    sectionType: { type: String },
    serviceIds: [
      {
        type: Schema.Types.ObjectId,
      },
    ],

    content: { type: Schema.Types.Mixed, default: {} },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "HomeSection",
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

HomeSectionSchema.index({ status: 1, orderBy: 1 });
HomeSectionSchema.index({ sectionType: 1 });

const HomeSection =
  mongoose.models.HomeSection ||
  mongoose.model<IHomeSection>("HomeSection", HomeSectionSchema);

export default HomeSection;
