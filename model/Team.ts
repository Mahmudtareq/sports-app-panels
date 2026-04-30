import { Document, model, models, Schema } from "mongoose";

export interface ITeam extends Document {
  name: string;
  designation: string;
  image: string;
  status: boolean;
  order: number;
}
const TeamSchema: Schema = new Schema<ITeam>(
  {
    name: {
      type: String,
    },
    designation: {
      type: String,
    },
    image: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
TeamSchema.index({ status: 1, createdAt: -1 });
TeamSchema.index({ status: 1, name: 1 });
TeamSchema.index({ createdAt: -1 });

export const Team = models.Team || model<ITeam>("Team", TeamSchema, "teams");
