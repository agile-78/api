import { describe, it } from "mocha";
import { errorHandler } from "../../middleware/errorHandler";
import {
  BadRequestError,
  CustomApiError,
  NotFoundError,
  UnAuthenticatedError,
  UnAuthorizedError,
} from "../../errors";
import { Request } from "express";
import { createFakeResponse } from "../utils/helpers";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StatusCodes } from "http-status-codes";

use(chaiAsPromised);

async function checkIfCorrectStatusAndMsgIsReturned(
  Error: typeof CustomApiError
) {
  it(`Correct Response is returned for ${Error.name}`, async () => {
    const msg = "There is no user with id 1";
    const { res, status } = createFakeResponse((data) => {
      expect(data.err.message).to.be.equals(msg);
    });

    await expect(errorHandler(new Error(msg), {} as Request, res, () => {})).to
      .be.fulfilled;

    status.calledOnceWithExactly(StatusCodes.BAD_REQUEST);
  });
}

describe("errorHandler Middleware", () => {
  for (let err of [
    BadRequestError,
    NotFoundError,
    UnAuthenticatedError,
    UnAuthorizedError,
  ]) {
    checkIfCorrectStatusAndMsgIsReturned(err);
  }
});
