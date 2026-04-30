import mongoose, { Schema, Types, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  status: boolean;
  featured: boolean;
  position: number;
  parent?: Types.ObjectId | ICategory | null;
}

const CategorySchema: Schema = new Schema<ICategory>(
  {
    name: { type: String, trim: true, required: true },
    slug: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    status: { type: Boolean, default: true },
    position: { type: Number, default: 0 },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
CategorySchema.index({ parent: 1, position: 1 });
CategorySchema.index({ status: 1, parent: 1 });
CategorySchema.index({ featured: 1, status: 1 });
const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema, "categories");

export default Category;
