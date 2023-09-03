import { describe } from "mocha";
import { IRedemption, IRedemptionMethods, Redemption } from "../../models";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";

import {
  cannotCreateModelWithoutRequiredFieldsTest,
  createModelTest,
} from "../utils/helpers";
import { IUser, IUserMethods, User } from "../../models";
import { Schema, Error } from "mongoose";
import { IReward, IRewardMethods, Reward } from "../../models";

use(chaiAsPromised);

describe("Redemption model", () => {
  let redemption: IRedemption & IRedemptionMethods;
  let user: IUser & IUserMethods;
  let reward: IReward & IRewardMethods;

  const redemptionData: {
    userId: null | Schema.Types.ObjectId;
    rewardId: null | Schema.Types.ObjectId;
  } = {
    userId: null,
    rewardId: null,
  };

  beforeEach(async () => {
    user = await User.create({
      name: "test",
      email: "test@gmail.com",
      password: "password123",
    });

    reward = await Reward.create({
      title: "test reward 5$",
      points: 30,
      logo: "./tests/assets/profilePic.png",
    });

    redemptionData.userId = user._id;

    redemptionData.rewardId = reward._id;

    redemption = await Redemption.create(redemptionData);
  });

  it("created a Redemption and saved successfully", async () => {
    createModelTest(redemption, Redemption, redemptionData);
  });

  it("Redemption without required fields are not created", async () => {
    await cannotCreateModelWithoutRequiredFieldsTest(Redemption, [
      "userId",
      "rewardId",
    ]);
  });

  it("a redemption is not created with invalid userId & rewardId", async () => {
    expect(
      Redemption.create({
        userId: "ererr3",
        rewardId: "erere",
      })
    ).to.be.rejectedWith(Error.ValidationError);
  });
});
