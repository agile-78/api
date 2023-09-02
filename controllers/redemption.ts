import { StatusCodes } from "http-status-codes";
import { Redemption } from "../models/Redemption";
import { Request, Response } from "express";

export async function create(req: Request, res: Response) {
  const redemption = await Redemption.create(req.body);
  res.status(StatusCodes.CREATED).send({
    redemption,
  });
}
