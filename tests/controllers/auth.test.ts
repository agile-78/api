import { assert, expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { login, register } from "../../controllers/auth";
import { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../../errors";
import { User } from "../../models/User";
import sinon from "sinon";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/constant";

use(chaiAsPromised);

describe("Auth controller", () => {
  describe("register", () => {
    const res = {} as Response;
    let token: string;
    const status = sinon.fake.returns(res);
    res.status = status;
    res.send = (data) => {
      token = data.token;
      return res;
    };

    it("jwt is returned for successfully signin", async () => {
      const mockRequest = {
        body: {
          name: "Test",
          email: "test@gmail.com",
          password: "password123",
        },
      } as Request;

      await expect(register(mockRequest, res)).to.eventually.fulfilled;

      assert.isTrue(status.calledOnce);
      assert.isTrue(status.calledWith(StatusCodes.CREATED));
      expect(verify(token, JWT_SECRET)).to.be.ok;
    });
  });

  describe("login", () => {
    const res = {} as Response;

    res.status = sinon.fake.returns(res);
    res.send = sinon.fake.returns(res);

    it("BadRequest is thrown for requests without required params", async () => {
      const mockRequest = {
        body: {},
      } as Request;
      await expect(login(mockRequest, res)).to.rejectedWith(BadRequestError);
    });

    it("NotFound is thrown for user not saved in database", async () => {
      const mockRequest = {
        body: {
          email: "hello@gmail.com",
          password: "password123",
        },
      } as Request;

      await expect(login(mockRequest, res)).to.rejectedWith(NotFoundError);
    });

    it("user with invalid credentials is not logged in", async () => {
      const user = await User.create({
        name: "test",
        email: "test@gmail.com",
        password: "password123",
      });

      const mockRequest = {
        body: {
          email: "test@gmail.com",
          password: "wrongPassword",
        },
      } as Request;

      await expect(login(mockRequest, res)).to.be.rejectedWith(
        UnAuthenticatedError
      );
    });

    it("correct user is able to login", async () => {
      const userData = {
        name: "test",
        email: "test@gmail.com",
        password: "password123",
      };
      const user = await User.create(userData);

      const mockRequest = {
        body: userData,
      } as Request;

      await expect(login(mockRequest, res)).to.eventually.fulfilled;
    });
  });
});