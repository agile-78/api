import { assert, expect } from "chai";
import { Error } from "mongoose";
import { Request, Response } from "express";
import Sinon from "sinon";
import { NotFoundError } from "../../errors";

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
