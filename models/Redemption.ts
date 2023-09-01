import { Model, Schema, model } from "mongoose";

export interface IRedemption {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRedemptionMethods {}

export type RedemptionModel = Model<IRedemption, {}, IRedemptionMethods>;

const RedemptionSchema = new Schema<
  IRedemption,
  RedemptionModel,
  IRedemptionMethods
>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Redemption must have a claimer"],
    },
  },
  {
    timestamps: true,
  }
);

export const Redemption = model<IRedemption, RedemptionModel>(
  "Redemption",
  RedemptionSchema
);
