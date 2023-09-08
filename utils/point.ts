import { Types } from "mongoose";
import { Redemption } from "../models/Redemption";
import { RecyclingActivity } from "../models/RecyclingActivity";
import { IRecyclingMaterial, IReward } from "../models";

export const queryUserPoints = async (id: Types.ObjectId) => {
  let redemptions = await Redemption.find({
    userId: id,
  })
    .select("rewardId")
    .populate<{
      rewardId: IReward;
    }>("rewardId");
  let redempedPoints = redemptions.reduce((total, current) => {
    return total + current.rewardId.points;
  }, 0);

  let recycling = await RecyclingActivity.find({
    userId: id,
  })
    .select(["materialId", "quantity"])
    .populate<{
      materialId: IRecyclingMaterial;
    }>("materialId");

  let recyclingPoints = recycling.reduce((total, current) => {
    return total + (current.quantity || 1) * current.materialId.points;
  }, 0);

  let totalPoints = recyclingPoints - redempedPoints;

  return totalPoints;
};
