import { before, describe, it } from "mocha";
import { createDummyUser, createDummyUserRewardAndRedemption } from "./helpers";
import { RecyclingMaterial } from "../../models/RecyclingMaterial";
import { RecyclingActivity } from "../../models/RecyclingActivity";
import { expect, use } from "chai";
import { queryUserPoints } from "../../utils/point";
import chaiAsPromised from "chai-as-promised";
import { IUser } from "../../models/User";
import { HydratedDocument } from "mongoose";

use(chaiAsPromised);

describe("QueryUserPoints", () => {
  let user: HydratedDocument<IUser>;
  let totalPoints = 0;
  before(async () => {
    const {
      redemption,
      user: dummyUser,
      reward,
    } = await createDummyUserRewardAndRedemption();

    totalPoints = -reward.points;

    user = dummyUser;

    let material = await RecyclingMaterial.create({
      name: "test material",
      points: 30,
    });
    let activity = await RecyclingActivity.create({
      userId: user._id,
      materialId: material._id,
      quantity: 2,
    });

    await createDummyUser({
      referredBy: user._id,
      email: "test2@gmail.com",
    });

    totalPoints += activity.quantity * material.points + 10;
  });
  it("returns the correct point", async () => {
    await expect(queryUserPoints(user._id)).to.eventually.equals(totalPoints);
  });
});
