import { model, models } from "mongoose";
import { Document, Schema } from "mongoose";

export interface ITestimonial extends Document {
  heading: string;
  subHeading: string;
  image: string;
  quote: string;
  authorName: string;
  authorRole: string;
  order: number;
  status: boolean;
}
const TestimonialSchema = new Schema<ITestimonial>(
  {
    image: {
      type: String,
      required: true,
    },
    quote: {
      type: String,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorRole: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Testimonial =
  models.Testimonial ||
  model<ITestimonial>("Testimonial", TestimonialSchema, "testimonials");
