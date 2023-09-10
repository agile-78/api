import { before, describe, it } from "mocha";
import { createDummyUser, createDummyUserRewardAndRedemption } from "./helpers";
import { RecyclingMaterial } from "../../models/RecyclingMaterial";
import { RecyclingActivity } from "../../models/RecyclingActivity";
import { expect, use } from "chai";
import { queryReferredCount, queryUserPoints } from "../../utils/point";
import chaiAsPromised from "chai-as-promised";
import { IUser } from "../../models/User";
import { HydratedDocument } from "mongoose";

use(chaiAsPromised);

describe("Query Utils", () => {
  let user: HydratedDocument<IUser>;
  let user2: HydratedDocument<IUser>;
  let totalPoints = 0;
  beforeEach(async () => {
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

    user2 = await createDummyUser({
      referredBy: user._id,
      email: "test2@gmail.com",
    });

    totalPoints += activity.quantity * material.points + 10;
  });
  it("queryUserPoints the correct point", async () => {
    await expect(queryUserPoints(user._id)).to.eventually.equals(totalPoints);
  });

  it("queryReferralCount retuns the correct count", async () => {
    await expect(queryReferredCount(user._id)).to.eventually.equals(1);

    await expect(queryReferredCount(user2._id)).to.eventually.equals(0);
  });
});
