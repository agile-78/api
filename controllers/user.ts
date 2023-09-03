import { Request, Response } from "express";
import { User } from "../models";
import { NotFoundError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { unlink } from "fs/promises";

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new NotFoundError(`No user with id ${id}`);
  }

  if (user.profilePic) {
    unlink(user.profilePic);
  }

  res.status(StatusCodes.NO_CONTENT).send();
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (req.file?.path) {
    const oldUser = await User.findById(id).select("profilePic");
    if (oldUser?.profilePic) {
      unlink(oldUser.profilePic);
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
