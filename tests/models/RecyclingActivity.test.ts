import { describe } from "mocha";
import {
  IRecyclingActivity,
  IRecyclingActivityMethods,
  RecyclingActivity,
} from "../../models/RecyclingActivity";
import { use } from "chai";
import chaiAsPromised from "chai-as-promised";

import {
  cannotCreateModelWithoutRequiredFieldsTest,
  createDummyUser,
  createModelTest,
} from "../utils/helpers";
import { IUser, IUserMethods, User } from "../../models/User";
import {
  IRecyclingMaterial,
  IRecyclingMaterialMethods,
  RecyclingMaterial,
} from "../../models/RecyclingMaterial";

use(chaiAsPromised);

describe("RecyclingActivity model", () => {
  let recyclingActivity: IRecyclingActivity & IRecyclingActivityMethods;
  let user: IUser & IUserMethods;
  let material: IRecyclingMaterial & IRecyclingMaterialMethods;
  const RecyclingActivityData: Partial<IRecyclingActivity> = {
    materialId: undefined,
    userId: undefined,
    quantity: 1,
  };

  beforeEach(async () => {
    user = await createDummyUser();
    material = await RecyclingMaterial.create({
      name: "test material",
      points: 30,
    });
    RecyclingActivityData.materialId = material._id;
    RecyclingActivityData.userId = user._id;
    recyclingActivity = await RecyclingActivity.create(RecyclingActivityData);
  });

  it("created a RecyclingActivity and saved successfully", async () => {
    createModelTest(
      recyclingActivity,
      RecyclingActivity,
      RecyclingActivityData
    );
  });

  it("RecyclingActivity without required fields are not created", async () => {
    await cannotCreateModelWithoutRequiredFieldsTest(RecyclingActivity, [
      "materialId",
      "userId",
    ]);
  });
});
