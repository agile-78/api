import { Request, Response } from "express";
import { User } from "../models";
import { NotFoundError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { unlink } from "fs/promises";
import {
  queryRecycleCount,
  queryReferredCount,
  queryUserPoints,
} from "../utils/point";

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("Cannot find user");
  }

  const { password: _, ...jsonUser } = user.toJSON();

  res.status(StatusCodes.OK).send({
    user: jsonUser,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new NotFoundError(`No user with id ${id}`);
  }

  if (user.profilePic) {
    await unlink(user.profilePic);
  }

  res.status(StatusCodes.NO_CONTENT).send();
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (req.file?.path) {
    const oldUser = await User.findById(id).select("profilePic");
    if (oldUser?.profilePic) {
      await unlink(oldUser.profilePic);
    }

    req.body["profilePic"] = req.file.path;
  }

  const user = await User.findByIdAndUpdate(
    id,
    { ...req.body },
    { runValidators: true, new: true }
  );

  if (!user) {
    throw new NotFoundError(`No user with id ${id}`);
  }

  res.status(StatusCodes.OK).send({
    user,
  });
};

export const getUserPoints = async (req: Request, res: Response) => {
  const { id } = req.params;

  res.status(StatusCodes.OK).send({
    points: await queryUserPoints(id),
  });
};

export const getUserReferredCount = async (req: Request, res: Response) => {
  const { id } = req.params;
  const count = await queryReferredCount(id);
  res.status(StatusCodes.OK).send({
    count,
  });
};

export const getUserRecycleCount = async (req: Request, res: Response) => {
  const { id } = req.params;
  const count = await queryRecycleCount(id);
  res.status(StatusCodes.OK).send({
    count,
  });
};
