import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { RecyclingActivity } from "../models/RecyclingActivity";

export async function create(req: Request, res: Response) {
  const reward = await RecyclingActivity.create(req.body);
  res.status(StatusCodes.CREATED).send({
    reward,
  });
}
