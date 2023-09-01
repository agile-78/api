import { Model, Schema, model } from "mongoose";

export interface IReward {
  _id: Schema.Types.ObjectId;
  logo: string;
  title: string;
  points: number;
}

export interface IRewardMethods {}

export type RewardModel = Model<IReward, {}, IRewardMethods>;

const RewardSchema = new Schema<IReward, RewardModel, IRewardMethods>({
  logo: {
    type: String,
    required: [true, "Logo must be provided"],
  },
  title: {
    type: String,
    required: [true, "Title must be provided"],
  },
  points: {
    type: Number,
    required: [true, "Points must be provided"],
  },
});

export const Reward = model<IReward, RewardModel>("Reward", RewardSchema);
