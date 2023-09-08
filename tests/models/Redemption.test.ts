import { describe } from "mocha";
import { IRedemption, Redemption } from "../../models";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";

import {
  cannotCreateModelWithoutRequiredFieldsTest,
  createModelTest,
} from "../utils/helpers";
import { User } from "../../models";
import { Error, HydratedDocument, Types } from "mongoose";
import { Reward } from "../../models";

use(chaiAsPromised);

describe("Redemption model", () => {
  let redemption: HydratedDocument<IRedemption>;
  let user;
  let reward;

  const redemptionData: {
    userId: null | Types.ObjectId;
    rewardId: null | Types.ObjectId;
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
