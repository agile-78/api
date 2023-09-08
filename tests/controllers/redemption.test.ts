import { describe } from "mocha";
import { createFakeResponse } from "../utils/helpers";
import { Request } from "express";
import { create } from "../../controllers/redemption";
import { expect } from "chai";
import { IUser, User } from "../../models";
import { IReward, IRewardMethods, Reward } from "../../models";
import { HydratedDocument } from "mongoose";

describe("Redemption Controller", () => {
  describe("post", () => {
    let user: HydratedDocument<IUser>;
    let reward: HydratedDocument<IReward>;
    const { res, status } = createFakeResponse((data) => {});

    const mockRequest = {
      body: {},
    } as Request;

    beforeEach(async () => {
      user = await User.create({
        name: "test",
        email: "test@gmail.com",
        password: "password123",
      });

      reward = await Reward.create({
        title: "test title 5$",
        points: 50,
        logo: "./tests/assets/profilePic.png",
      });

      mockRequest.body.userId = user._id;
      mockRequest.body.rewardId = reward._id;
    });

    it("correct status code and response is returned", async () => {
      let redemption;
      const { res } = createFakeResponse((data) => {
        redemption = data.redemption;
      });

      await expect(create(mockRequest, res)).to.eventually.fulfilled;
      expect(redemption).to.have.property("userId").to.equals(user._id);
      expect(redemption).to.have.property("rewardId").to.equals(reward._id);
    });
  });
});
