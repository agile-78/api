import { describe } from "mocha";
import { createFakeResponse } from "../utils/helpers";
import { Request } from "express";
import { assert, expect } from "chai";
import {
  IRecyclingMaterial,
  IRecyclingMaterialMethods,
} from "../../models/RecyclingMaterial";
import { create } from "../../controllers/material";
import { StatusCodes } from "http-status-codes";

describe("materi Controller", () => {
  describe("post", () => {
    let material: IRecyclingMaterial & IRecyclingMaterialMethods;
    const { res, status } = createFakeResponse((data) => {});

    const mockRequest = {
      body: {
        name: "test material",
        points: 20,
      },
    } as Request;

    it("correct status code and response is returned", async () => {
      const { res, status } = createFakeResponse((data) => {
        material = data.redemption;
      });

      await expect(create(mockRequest, res)).to.eventually.fulfilled;
      assert.isTrue(status.calledOnceWithExactly(StatusCodes.CREATED));
    });
  });
});
