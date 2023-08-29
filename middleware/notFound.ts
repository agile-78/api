import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function notFound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(StatusCodes.NOT_FOUND).send({
    msg: "Resource not found",
  });
}
