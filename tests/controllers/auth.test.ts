import { assert, expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { login, register } from "../../controllers/auth";
import { Request } from "express";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../../errors";
import { User } from "../../models";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/constant";
import { createFakeResponse } from "../utils/helpers";
import { JwtPayload } from "../../types/jsonwebtoken";

use(chaiAsPromised);

describe("Auth controller", () => {
  describe("register", () => {
    let token: string;
    const { res, status } = createFakeResponse((data) => {
      token = data.token;
    });

    const mockRequest = {
      body: {
        name: "Test",
        email: "test@gmail.com",
        password: "password123",
      },
    } as Request;

    it("jwt is returned for successfully signin", async () => {
      await expect(register(mockRequest, res)).to.eventually.fulfilled;

      assert.isTrue(status.calledOnce);
      assert.isTrue(status.calledWith(StatusCodes.CREATED));
      expect(verify(token, JWT_SECRET)).to.be.ok;
    });

    it("handle profilePic correctly", async () => {
      let token: string = "";
      const { res } = createFakeResponse((data) => {
        token = data.token;
      });

      const path = "./tests/assets/profilePic.png";
      await expect(
        register(
          {
            ...mockRequest,
            file: {
              path,
            } as any,
          } as Request,
          res
        )
      ).to.eventually.fulfilled;
      const { id } = verify(token, JWT_SECRET) as JwtPayload;
      const user = await User.findById(id).select("profilePic");
      expect(user).property("profilePic").to.equals(path);
    });
  });

  describe("login", () => {
    const { res, status } = createFakeResponse();

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

    it("Correct user is able to login", async () => {
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
      assert.isTrue(status.calledOnceWith(StatusCodes.OK));
    });
  });
});
