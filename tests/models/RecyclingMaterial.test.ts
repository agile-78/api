import { describe } from "mocha";
import {
  IRecyclingMaterial,
  IRecyclingMaterialMethods,
  RecyclingMaterial,
} from "../../models";
import { use } from "chai";
import chaiAsPromised from "chai-as-promised";

import {
  cannotCreateModelWithoutRequiredFieldsTest,
  createModelTest,
} from "../utils/helpers";

use(chaiAsPromised);

describe("RecyclingMaterial model", () => {
  let recyclingMaterial: IRecyclingMaterial & IRecyclingMaterialMethods;
  const RecyclingMaterialData = {
    name: "test material",
    points: 0,
  };

  beforeEach(async () => {
    recyclingMaterial = await RecyclingMaterial.create(RecyclingMaterialData);
  });

  it("created a RecyclingMaterial and saved successfully", async () => {
    createModelTest(
      recyclingMaterial,
      RecyclingMaterial,
      RecyclingMaterialData
    );
  });

  it("RecyclingMaterial without required fields are not created", async () => {
    await cannotCreateModelWithoutRequiredFieldsTest(RecyclingMaterial, [
      "name",
      "points",
    ]);
  });
});
