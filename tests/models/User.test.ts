import { before, describe } from "mocha";
import { IUser, IUserMethods, User, UserModel } from "../../models/User";
import { assert, expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/constant";

import { Error } from "mongoose";

use(chaiAsPromised);

describe("User model", () => {
  let user: IUser & IUserMethods;
  const userData = {
    name: "Test",
    email: "test@gmail.com",
    password: "password123",
    address: "address",
    contact_number: "12345",
  };

  before(async () => {
    user = await User.create(userData);
  });

  it("created a user and saved successfully", async () => {
    assert.notEqual(user, undefined);
    expect(user).to.have.property("_id");
    expect(user).to.have.property("name").to.equal("Test");
    expect(user).to.have.property("email").to.equal("test@gmail.com");
    expect(user).to.have.property("address").to.equal("address");
    expect(user).to.have.property("contact_number").to.equal("12345");
    expect(user).to.be.an.instanceOf(User);
  });

  it("password is hashed", () => {
    expect(user.password).to.not.equal("password123");
  });

  it("password comparison method", async () => {
    assert.isTrue(
      await user.comparePassword("password123"),
      "return true for correct method"
    );
    assert.isFalse(
      await user.comparePassword("notMatch"),
      "return false for invalid password"
    );
  });

  it("correct payload is sent in jwt token", async () => {
    const token = await user.createJWT();
    const payload = verify(token, JWT_SECRET) as JwtPayload;
    expect(payload.id).to.equal(user._id.toString());
    expect(payload).to.have.property("exp");
  });

  it("user with invalid email is not created", async () => {
    const userData = {
      name: "test",
      email: "invalid",
      password: "password123",
    };

    const createUserWithInvalidEmail = async () => await User.create(userData);

    await expect(createUserWithInvalidEmail()).to.be.rejectedWith(
      Error.ValidationError
    );
  });

  it("user without required fields are not created", async () => {
    const createUserWithoutRequiredFields = async () => await User.create({});

    await expect(createUserWithoutRequiredFields()).to.be.rejectedWith(
      Error.ValidationError
    );

    try {
      await createUserWithoutRequiredFields();
    } catch (e: any) {
      expect(e.errors).to.include.all.keys(["name", "password", "email"]);
    }
  });

  it("user is created without unrequired fields", async () => {
    const user = await User.create({
      name: "test",
      password: "password1234",
      email: "example@gmail.com",
    });

    expect(user).to.be.an.instanceOf(User);
    expect(user).to.have.property("address").to.be.undefined;
    expect(user).to.have.property("contact_number").to.be.undefined;
  });
});
