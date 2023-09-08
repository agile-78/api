import { Model, Schema, Types, model } from "mongoose";

export interface IRecyclingActivity {
  materialId: Types.ObjectId;
  userId: Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecyclingActivityMethods {}

export type RecyclingActivityModel = Model<
  IRecyclingActivity,
  {},
  IRecyclingActivityMethods
>;

const RecyclingActivitySchema = new Schema<
  IRecyclingActivity,
  RecyclingActivityModel,
  IRecyclingActivityMethods
>(
  {
    materialId: {
      type: Schema.Types.ObjectId,
      ref: "RecyclingMaterial",
      required: [true, "Material must be provided"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User must be provided"],
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const RecyclingActivity = model<
  IRecyclingActivity,
  RecyclingActivityModel
>("RecyclingActivity", RecyclingActivitySchema);
