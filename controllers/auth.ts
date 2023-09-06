import { Request, Response } from "express";
import { User } from "../models";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors";

export async function register(req: Request, res: Response) {
  const user = await User.create({
    ...req.body,
    profilePic: req.file?.path || null,
  });

  const { password, ...data } = user;
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).send({
    token,
    user: data,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password must be provided");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("Cannot find user");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid credentials");
  }

  const token = user.createJWT();

  const { password: _, ...data } = user;

  res.status(StatusCodes.OK).send({
    user: data,
    token,
  });
}
