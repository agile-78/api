import { assert, expect, use } from "chai";
import { Request } from "express";
import chaiAsPromised from "chai-as-promised";
import {
  NotFoundErrorisThrownForInvalidId,
  createDummyUser,
  createDummyUserWithProfilePic,
  createFakeResponse,
} from "../utils/helpers";
import { deleteUser, getUserPoints, updateUser } from "../../controllers/user";
import { IUser, User, UserModel } from "../../models/User";
import { StatusCodes } from "http-status-codes";
import { access } from "fs/promises";
import { constants } from "fs";
import { Reward } from "../../models/Reward";
import { Redemption } from "../../models/Redemption";
import { RecyclingMaterial } from "../../models/RecyclingMaterial";
import { RecyclingActivity } from "../../models/RecyclingActivity";

use(chaiAsPromised);
describe("User controller", () => {
  describe("update", () => {
    it("Notfound is thrown for id that does not exist", async () => {
      await NotFoundErrorisThrownForInvalidId(updateUser);
    });

    it("Delete the old profile pic", async () => {
      let user = await createDummyUserWithProfilePic();
      let imagePath = user.profilePic as string;
      const { res } = createFakeResponse((data) => {
        user = data.user;
      });

      const req = {
        params: {
          id: user.id as unknown as string,
        },
        body: {},
        file: {
          path: "./tests/assets/new.png",
        } as any,
      } as Partial<Request> as Request;

      await expect(updateUser(req, res)).to.eventually.fulfilled;
      expect(user).property("profilePic").to.be.equal("./tests/assets/new.png");

      await expect(access(imagePath, constants.F_OK)).to.be.rejectedWith(Error);
    });

    it("Changes are saved in database", async () => {
      let updatedUser: UserModel = {} as any;
      const { res, status } = createFakeResponse((data) => {
        updatedUser = data.user;
      });

      const user = await createDummyUser();

      const mockRequest = {
        body: {
          name: "updated",
        },
        params: {
          id: user._id as unknown as string,
        },
      } as Partial<Request> as Request;

      await expect(updateUser(mockRequest, res)).to.eventually.fulfilled;
      assert.isTrue(status.calledOnceWith(StatusCodes.OK));
      expect(updatedUser.name).to.equal("updated");
    });
  });

  describe("delete", () => {
    it("Notfound is thrown for id that does not exist", async () => {
      await NotFoundErrorisThrownForInvalidId(deleteUser);
    });

    it("User is deleted from database", async () => {
      let user = await createDummyUser();
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

    it("Profile pic is deleted when user is deleted from database", async () => {
      const user = await createDummyUserWithProfilePic();
      const { res } = createFakeResponse();
      const req = {
        params: {
          id: user._id as unknown,
        },
      } as Partial<Request> as Request;
      await expect(deleteUser(req, res)).to.be.eventually.fulfilled;
      await expect(
        access(user.profilePic as string, constants.F_OK)
      ).to.be.rejectedWith(Error);
    });
  });

  describe("get points", () => {
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

    it("return the correct status and points", async () => {
      let points: number;
      const { res, status } = createFakeResponse((data) => {
        points = data.points;
      });

      await expect(
        getUserPoints(
          {
            params: {
              id: user._id as unknown,
            },
          } as Partial<Request> as Request,
          res
        )
      ).to.fulfilled;
    });
  });
});
