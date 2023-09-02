import { Model, Schema, model } from "mongoose";

export interface IRedemption {
  _id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  rewardId: Schema.Types.ObjectId;
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
    rewardId: {
      type: Schema.Types.ObjectId,
      ref: "Reward",
      required: [true, "Redemption must have a reward"],
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
