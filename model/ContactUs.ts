import mongoose, { Document, Schema, Types } from "mongoose";

export interface IContactus extends Document {
  name: string;
  email: string;
  message: string;
  phone: string;
  status: boolean;
  category: Types.ObjectId;
}
const ContactusSchema = new Schema<IContactus>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    message: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Contactus =
  mongoose.models.Contactus ||
  mongoose.model<IContactus>("Contactus", ContactusSchema);
