import { describe } from "mocha";
import { IReward, IRewardMethods, Reward } from "../../models";
import { use } from "chai";
import chaiAsPromised from "chai-as-promised";

import {
  cannotCreateModelWithoutRequiredFieldsTest,
  createModelTest,
} from "../utils/helpers";

use(chaiAsPromised);

describe("Reward model", () => {
  let reward: IReward & IRewardMethods;
  const RewardData = {
    title: "test",
    points: 30,
    logo: "./tests/assets/profilePic.png",
  };

  beforeEach(async () => {
    reward = await Reward.create(RewardData);
  });

  it("created a Reward and saved successfully", async () => {
    createModelTest(reward, Reward, RewardData);
  });

  it("Reward without required fields are not created", async () => {
    await cannotCreateModelWithoutRequiredFieldsTest(Reward, [
      "title",
      "points",
      "logo",
    ]);
  });
});
