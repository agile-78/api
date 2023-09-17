import { StatusCodes } from "http-status-codes";
import { IRecyclingMaterial, RecyclingMaterial } from "../models";
import { Request, Response } from "express";
import { generateGetAll } from "../utils/controller";

export async function create(req: Request, res: Response) {
  const reward = await RecyclingMaterial.create(req.body);
  res.status(StatusCodes.CREATED).send({
    reward,
  });
}

export const getAll = generateGetAll<IRecyclingMaterial>(
  RecyclingMaterial,
  undefined,
  undefined
);
