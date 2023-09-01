import { describe } from "mocha";
import { createFakeResponse } from "../utils/helpers";
import { Request } from "express";
import { create } from "../../controllers/reward";
import { expect } from "chai";

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
});
