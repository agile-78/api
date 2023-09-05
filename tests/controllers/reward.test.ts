import { describe } from "mocha";
import { createFakeResponse } from "../utils/helpers";
import { Request } from "express";
import { create, get } from "../../controllers/reward";
import { expect } from "chai";
import { Reward } from "../../models";
import { StatusCodes } from "http-status-codes";

describe("Reward Controller", () => {
  describe("post", () => {
    const { res, status } = createFakeResponse((data) => {});

    const mockRequest = {
      body: {
        title: "test",
        points: 30,
      },
    } as Request;

    it("handle logo correctly", async () => {
      let reward;
      const { res } = createFakeResponse((data) => {
        reward = data.reward;
      });

      const path = "./tests/assets/profilePic.png";
      await expect(
        create(
          {
            ...mockRequest,
            file: {
              path,
            } as any,
          } as Request,
          res
        )
      ).to.eventually.fulfilled;

      expect(reward).property("logo").to.equals(path);
    });
  });

  describe("get", () => {
    before(async () => {
      for (let i = 0; i < 5; i++) {
        await Reward.create({
          title: `test${i}`,
          points: i * 10,
          logo: "/imgs/desktop.png",
        });
      }
    });

    it("response is correct", async () => {
      const { res, status } = createFakeResponse((data) => {
        expect(data.rewards.length).to.equals(5);
      });

      await expect(get({} as Request, res)).to.be.fulfilled;

      status.calledOnceWithExactly(StatusCodes.OK);
    });
  });
});
