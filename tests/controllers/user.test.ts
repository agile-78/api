import { assert, expect, use } from "chai";
import { Request } from "express";
import chaiAsPromised from "chai-as-promised";
import {
  NotFoundErrorisThrownForInvalidId,
  createFakeResponse,
} from "../utils/helpers";
import { deleteUser, updateUser } from "../../controllers/user";
import { User, UserModel } from "../../models/User";
import { StatusCodes } from "http-status-codes";

use(chaiAsPromised);
describe("User controller", () => {
  describe("update", () => {
    it("Notfound is thrown for id that does not exist", async () => {
      await NotFoundErrorisThrownForInvalidId(updateUser);
    });

    it("Changes are saved in database", async () => {
      const userData = {
        name: "test",
        email: "test@gamil.com",
        password: "password123",
      };
      let updatedUser: UserModel = {} as any;
      const { res, status } = createFakeResponse((data) => {
        updatedUser = data.user;
      });

      const user = await User.create(userData);

      const mockRequest = {
        body: {
          name: "updated",
        },
        params: {
          id: user._id as unknown as string,
        },
      } as Partial<Request>;

      await expect(updateUser(mockRequest as Request, res)).to.eventually
        .fulfilled;
      assert.isTrue(status.calledOnceWith(StatusCodes.OK));
      expect(updatedUser.name).to.equal("updated");
    });
  });

  describe("delete", () => {
    it("Notfound is thrown for id that does not exist", async () => {
      await NotFoundErrorisThrownForInvalidId(deleteUser);
    });

    it("User is deleted from database", async () => {
      const userData = {
        name: "test",
        email: "test@gamil.com",
        password: "password123",
      };
      let user = await User.create(userData);
      const { res, status } = createFakeResponse();
      const req = {
        params: {
          id: user._id as unknown,
        },
      } as Partial<Request> as Request;

      await expect(deleteUser(req, res)).to.be.eventually.fulfilled;
      await expect(User.findById(user._id)).to.eventually.be.null;
      assert.isTrue(status.calledOnceWith(StatusCodes.NO_CONTENT));
    });
  });
});
