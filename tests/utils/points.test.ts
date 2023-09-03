import { before, describe, it } from "mocha";
import { createDummyUser } from "./helpers";
import { Reward } from "../../models/Reward";
import { Redemption } from "../../models/Redemption";
import { RecyclingMaterial } from "../../models/RecyclingMaterial";
import { RecyclingActivity } from "../../models/RecyclingActivity";
import { expect, use } from "chai";
import { queryUserPoints } from "../../utils/point";
import chaiAsPromised from "chai-as-promised";
import { IUser } from "../../models/User";

use(chaiAsPromised);

describe("QueryUserPoints", () => {
  let user: IUser;
  before(async () => {
    user = await createDummyUser();
    let reward = await Reward.create({
      title: "test reard",
      points: 30,
      logo: "invalid.png",
    });
    let redemption = await Redemption.create({
      userId: user._id,
      rewardId: reward._id,
    });

    let material = await RecyclingMaterial.create({
      name: "test material",
      points: 30,
    });
    let activity = await RecyclingActivity.create({
      userId: user._id,
      materialId: material._id,
      quantity: 2,
    });
  });
  it("returns the correct point", async () => {
    expect(queryUserPoints(user._id)).to.eventually.equals(30);
  });
});
