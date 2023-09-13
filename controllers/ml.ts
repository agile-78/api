import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

export async function classify(req: Request, res: Response) {
  res.status(StatusCodes.OK).send();
}
