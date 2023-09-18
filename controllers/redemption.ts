import { StatusCodes } from "http-status-codes";
import { Redemption } from "../models";
import { Request, Response } from "express";
import { generateGetAll } from "../utils/controller";

export async function create(req: Request, res: Response) {
  const redemption = await Redemption.create(req.body);
  res.status(StatusCodes.CREATED).send({
    redemption,
  });
}

export const getAll = generateGetAll(Redemption, "rewardId", undefined);
