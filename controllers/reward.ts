import { StatusCodes } from "http-status-codes";
import { Reward } from "../models";
import { Request, Response } from "express";

export async function create(req: Request, res: Response) {
  const reward = await Reward.create({
    ...req.body,
    logo: req.file?.path || null,
  });
  res.status(StatusCodes.CREATED).send({
    reward,
  });
}

export async function get(req: Request, res: Response) {
  const rewards = await Reward.find({});

  res.status(StatusCodes.OK).send({
    rewards,
  });
}
