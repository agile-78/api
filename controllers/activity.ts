import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { RecyclingActivity } from "../models";

export async function create(req: Request, res: Response) {
  const activity = await RecyclingActivity.create(req.body);
  res.status(StatusCodes.CREATED).send({
    activity,
  });
}
