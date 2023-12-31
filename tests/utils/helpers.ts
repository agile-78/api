import { assert, expect } from "chai";
import { Error, HydratedDocument, Types } from "mongoose";
import { Request, Response } from "express";
import Sinon from "sinon";
import { NotFoundError } from "../../errors";
import {
  IRecyclingActivity,
  IRecyclingMaterial,
  IRedemption,
  IReward,
  IUser,
  RecyclingActivity,
  RecyclingMaterial,
  Redemption,
  Reward,
  User,
} from "../../models";
import { writeFile } from "fs/promises";

export function createModelTest<T, S, D>(
  instance: T,
  Model: S,
  data: D,
  notExactKeys: Array<string> = []
) {
  assert.notEqual(instance, undefined);
  expect(instance).to.have.property("_id");

  for (const key in data) {
    if (notExactKeys.length !== 0 && notExactKeys.includes(key)) {
      continue;
    }
    expect(instance).to.have.property(key).to.equal(data[key]);
  }

  expect(instance).to.be.an.instanceOf(Model);
}

export async function cannotCreateModelWithoutRequiredFieldsTest<T>(
  model: T & { create: (obj: Object) => Promise<Object> },
  requiredFields: Array<string> = []
) {
  const createModelWihtoutRequiredFields = async () => await model.create({});

  await expect(createModelWihtoutRequiredFields()).to.be.rejectedWith(
    Error.ValidationError
  );

  try {
    await createModelWihtoutRequiredFields();
  } catch (e: any) {
    expect(e.errors).to.include.all.keys(requiredFields);
  }
}

export async function NotFoundErrorisThrownForInvalidId(
  controller: (req: Request, res: Response) => Promise<void>,
  id = "62a23958e5a9e9b88f853a67"
) {
  const req = {
    params: {
      id,
    },
  } as Partial<Request> as Request;
  const { res, status } = createFakeResponse();
  await expect(controller(req, res)).to.be.rejectedWith(NotFoundError);
  assert.isTrue(status.notCalled, "There should be no response");
}

export function createFakeResponse(
  sendCallBack: (data: any) => void = () => {}
) {
  const res = {} as Response;
  const status = Sinon.fake.returns(res);
  res.status = status;
  res.send = (data) => {
    sendCallBack(data);
    return res;
  };

  return {
    res,
    status,
  };
}

export async function createDummyUser(
  body?: Partial<IUser>
): Promise<HydratedDocument<IUser>> {
  return await User.create({
    name: "test",
    email: "test@gmail.com",
    password: "password123",
    ...body,
  });
}

export async function createDummyUserWithProfilePic() {
  const profilePic = "./tests/assets/profilePic.png";
  await writeFile(profilePic, "abc");

  const user = await createDummyUser({
    profilePic,
  });

  return user;
}

export async function createDummyReward(body?: Partial<IReward>) {
  return await Reward.create({
    title: "test",
    points: 30,
    logo: "./imgs/desktop.png",
    ...body,
  });
}

export async function createDummyRedemption(body?: Partial<IRedemption>) {
  if (!body?.userId) {
    const user = await createDummyUser();
    body = {
      userId: user._id,
      ...body,
    };
  }

  if (!body?.rewardId) {
    const reward = await createDummyReward();
    body = {
      rewardId: reward._id,
      ...body,
    };
  }

  return await Redemption.create({
    ...body,
  });
}

export async function createDummyUserRewardAndRedemption({
  user,
  reward,
}: {
  user?: HydratedDocument<IUser>;
  reward?: HydratedDocument<IReward>;
} = {}) {
  user = await runIfNotExist<HydratedDocument<IUser>>(user, createDummyUser);
  reward = await runIfNotExist(reward, createDummyReward);
  const redemption = await createDummyRedemption({
    userId: user._id,
    rewardId: reward._id,
  });
  return {
    user,
    reward,
    redemption,
  };
}

export async function createDummyMaterial(body?: Partial<IRecyclingMaterial>) {
  return await RecyclingMaterial.create({
    name: "plastic",
    points: 30,
    ...body,
  });
}

export async function createDummyActivity(body?: Partial<IRecyclingActivity>) {
  if (!body?.userId) {
    const user = await createDummyUser();
    body = {
      userId: user._id,
      ...body,
    };
  }

  if (!body?.materialId) {
    const material = await createDummyMaterial();
    body = {
      materialId: material._id,
      ...body,
    };
  }
  return await RecyclingActivity.create({
    quantity: 1,
    ...body,
  });
}

export async function createDummyUserMaterialAndActvity({
  user,
  material,
}: {
  user?: HydratedDocument<IUser>;
  material?: HydratedDocument<IRecyclingMaterial>;
} = {}) {
  user = await runIfNotExist(user, createDummyUser);
  material = await runIfNotExist(material, createDummyMaterial);
  const activity = await createDummyActivity({
    userId: user._id,
    materialId: material._id,
  });

  return {
    user,
    material,
    activity,
  };
}

export async function runIfNotExist<Model>(
  val: Model | null | undefined,
  callback: () => Promise<Model>
) {
  if (val === undefined || val === null) {
    return await callback();
  }

  return val;
}

export async function createDummyDataForReferralCount(count: number) {
  let user: HydratedDocument<IUser> = await createDummyUser();
  for (let i = 0; i < count; i++) {
    await createDummyUser({
      email: `test${i}@gmail.com`,
      referredBy: user._id,
    });
  }

  return user;
}

export async function createDummyDataForCountingPoints() {
  const { user, reward } = await createDummyUserRewardAndRedemption();
  const { material, activity } = await createDummyUserMaterialAndActvity({
    user,
  });
  await createDummyUser({
    email: "test2@gmail.com",
    referredBy: user._id,
  });
  return reward.points + material.points * activity.quantity + 10;
}
