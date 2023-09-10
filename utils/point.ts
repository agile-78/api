import { Types } from "mongoose";
import { Redemption } from "../models/Redemption";
import { RecyclingActivity } from "../models/RecyclingActivity";
import { IRecyclingMaterial, IReward, User } from "../models";

export const queryUserPoints = async (id: string | Types.ObjectId) => {
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

  let referrealCount = await queryReferredCount(id);

  let referralPoints = referrealCount * 10;

  let totalPoints = referralPoints + recyclingPoints - redempedPoints;

  return totalPoints;
};

export const queryReferredCount = async (id: string | Types.ObjectId) => {
  return await User.countDocuments({
    referredBy: id,
  });
};
