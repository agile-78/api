import { Schema } from "mongoose";
import { Redemption } from "../models/Redemption";
import { RecyclingActivity } from "../models/RecyclingActivity";

export const queryUserPoints = async (id: Schema.Types.ObjectId) => {
  let redemptions = await Redemption.find({
    userId: id,
  })
    .select("rewardId")
    .populate("rewardId");
  let redempedPoints = redemptions.reduce((total, current) => {
    // @ts-ignore
    return total + current.rewardId.points;
  }, 0);

  let recycling = await RecyclingActivity.find({
    userId: id,
  })
    .select(["materialId", "quantity"])
    .populate("materialId");

  let recyclingPoints = recycling.reduce((total, current) => {
    // @ts-ignore
    return total + (current.quantity || 1) * current.materialId.points;
  }, 0);

  let totalPoints = recyclingPoints - redempedPoints;

  return totalPoints;
};