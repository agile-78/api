import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "../errors";
import { MongoServerError } from "mongodb";
export async function errorHandler(
  err: MongoServerError | CustomApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomApiError) {
    return res.status(err.status as number).send({
      err: {
        message: err.message,
      },
    });
  }

  const customError = {
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Internal server error",
  };

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field`;
    customError.status = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(", ");
    customError.status = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.status = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.status).json({
    err: {
      mesage: customError.msg,
    },
  });
}
