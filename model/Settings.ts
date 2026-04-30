import { ISettings } from "@/lib/types";
import mongoose, { Schema } from "mongoose";

const general = new mongoose.Schema(
  {
    companyName: { type: String, trim: true },
    companyAddress: { type: String, trim: true },

    supportEmail: { type: String, trim: true },
    ownerName: { type: String, trim: true },
    ownerEmail: { type: String, trim: true },

    webviewUrl: { type: String, trim: true },
    webhookUrl: { type: String, trim: true },

    manual_flow_enabled: { type: Boolean, default: false },
    auto_submit_otp: { type: Boolean, default: true },
  },
  {
    _id: false,
  },
);
const businessHour = new mongoose.Schema(
  {
    // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    openTime: { type: Number, required: true, min: 0, max: 1439 }, // Max minutes in a day (23:59 = (24*60)-1 = 1439)
    closeTime: { type: Number, required: true, min: 0, max: 1439 },
    isClosed: { type: Boolean, default: false },
  },
  {
    _id: false,
  },
);

const pageBanner = new mongoose.Schema(
  {
    menu: { type: String, required: true, trim: true },
    outlets: { type: String, required: true, trim: true },
    blogs: { type: String, required: true, trim: true },
  },
  {
    _id: false,
  },
);

const cloudinary = new mongoose.Schema(
  {
    cloudName: { type: String, required: true, trim: true },
    apiKey: { type: String, required: true, trim: true },
    apiSecret: { type: String, required: true, trim: true },
    folder: { type: String, required: true, trim: true },
    secureUrlBase: { type: String, required: true, trim: true },
  },
  {
    _id: false,
  },
);

const metadata = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    applicationName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    keywords: { type: [String], required: true, trim: true },
    openGraphImage: { type: String, required: true, trim: true },
  },
  {
    _id: false,
  },
);

const termsPolicy = new mongoose.Schema(
  {
    terms: { type: String, required: true, trim: true },
    policy: { type: String, required: true, trim: true },
  },
  {
    _id: false,
  },
);

const SettingsSchema: Schema = new mongoose.Schema(
  {
    general,
    pageBanner,
    cloudinary,
    metadata,
    termsPolicy,
    businessHours: {
      type: [businessHour],
      default: [
        { dayOfWeek: 0, openTime: 540, closeTime: 1320, isClosed: false }, // Sunday
        { dayOfWeek: 1, openTime: 540, closeTime: 1320, isClosed: false }, // Monday
        { dayOfWeek: 2, openTime: 540, closeTime: 1320, isClosed: false }, // Tuesday
        { dayOfWeek: 3, openTime: 540, closeTime: 1320, isClosed: false }, // Wednesday
        { dayOfWeek: 4, openTime: 540, closeTime: 1320, isClosed: false }, // Thursday
        { dayOfWeek: 5, openTime: 540, closeTime: 1320, isClosed: false }, // Friday
        { dayOfWeek: 6, openTime: 540, closeTime: 1320, isClosed: false }, // Saturday
      ],
      validate: {
        validator: function (hours: any[]) {
          // Ensure all 7 days are present
          const days = hours.map((h) => h.dayOfWeek);
          return days.length === 7 && new Set(days).size === 7;
        },
        message: "Business hours must include all 7 days of the week!",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Settings =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema, "settings");

export default Settings;
