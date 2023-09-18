import { StatusCodes } from "http-status-codes";
import { IRecyclingMaterial, RecyclingMaterial } from "../models";
import { Request, Response } from "express";
import { generalGet, generateGetAll } from "../utils/controller";
import { NotFoundError } from "../errors";

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

export const get = async (req: Request, res: Response) => {
  const { id } = req.params;
  const material = await generalGet(RecyclingMaterial, req, id);

  if (!material) {
    throw new NotFoundError(`Material with id ${id} is not found`);
  }
  res.status(StatusCodes.OK).send({
    material,
  });
};
