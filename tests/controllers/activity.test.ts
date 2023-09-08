import { describe } from "mocha";
import { createDummyUser, createFakeResponse } from "../utils/helpers";
import { Request } from "express";
import { assert, expect } from "chai";
import {
  IRecyclingActivity,
  IRecyclingActivityMethods,
  RecyclingMaterial,
} from "../../models";
import { create } from "../../controllers/activity";
import { StatusCodes } from "http-status-codes";

describe("materi Controller", () => {
  describe("post", () => {
    let ActiviRecyclingActivity: IRecyclingActivity & IRecyclingActivityMethods;
    let user;
    let material;

    const mockRequest = {
      body: {
        quantity: 1,
      },
    } as Request;

    beforeEach(async () => {
      user = await createDummyUser();
      material = await RecyclingMaterial.create({
        name: "test material",
        points: 30,
      });
      mockRequest.body.userId = user._id;
      mockRequest.body.materialId = material._id;
    });

    it("correct status code and response is returned", async () => {
      const { res, status } = createFakeResponse((data) => {
        ActiviRecyclingActivity = data.redemption;
      });

      await expect(create(mockRequest, res)).to.eventually.fulfilled;
      assert.isTrue(status.calledOnceWithExactly(StatusCodes.CREATED));
    });
  });
});
