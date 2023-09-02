import { Model, Schema, model } from "mongoose";

export interface IRecyclingMaterial {
  _id: Schema.Types.ObjectId;
  name: string;
  points: number;
}

export interface IRecyclingMaterialMethods {}

export type RecyclingMaterialModel = Model<
  IRecyclingMaterial,
  {},
  IRecyclingMaterialMethods
>;

const RecyclingMaterialSchema = new Schema<
  IRecyclingMaterial,
  RecyclingMaterialModel,
  IRecyclingMaterialMethods
>({
  name: {
    type: String,
    required: [true, "Name must be provided"],
  },
  points: {
    type: Number,
    required: [true, "Points must be provided"],
  },
});

export const RecyclingMaterial = model<
  IRecyclingMaterial,
  RecyclingMaterialModel
>("RecyclingMaterial", RecyclingMaterialSchema);
