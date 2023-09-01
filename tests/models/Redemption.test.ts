import { describe } from "mocha";
import {
  IRedemption,
  IRedemptionMethods,
  Redemption,
} from "../../models/Redemption";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";

import {
  cannotCreateModelWithoutRequiredFieldsTest,
  createModelTest,
} from "../utils/helpers";
import { IUser, IUserMethods, User } from "../../models/User";
import { Schema, Error } from "mongoose";

use(chaiAsPromised);

describe("Redemption model", () => {
  let redemption: IRedemption & IRedemptionMethods;
  let user: IUser & IUserMethods;

  const redemptionData: {
    userId: null | Schema.Types.ObjectId;
  } = {
    userId: null,
  };

  beforeEach(async () => {
    user = await User.create({
      name: "test",
      email: "test@gmail.com",
      password: "password123",
    });

    redemptionData.userId = user._id;

    redemption = await Redemption.create(redemptionData);
  });

  it("created a Redemption and saved successfully", async () => {
    createModelTest(redemption, Redemption, redemptionData);
  });

  it("Redemption without required fields are not created", async () => {
    await cannotCreateModelWithoutRequiredFieldsTest(Redemption, ["userId"]);
  });

  it("a redemption is not created with invalid userId", async () => {
    expect(
      Redemption.create({
        userId: "ererr3",
      })
    ).to.be.rejectedWith(Error.ValidationError);
  });
});
