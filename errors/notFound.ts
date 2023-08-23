import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./customError";

export class NotFoundError extends CustomApiError {
  public status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.NOT_FOUND;
  }
}
