import { StatusCodes } from "http-status-codes";
import { RecyclingMaterial } from "../models";
import { Request, Response } from "express";

export async function create(req: Request, res: Response) {
  const reward = await RecyclingMaterial.create(req.body);
  res.status(StatusCodes.CREATED).send({
    reward,
  });
}
