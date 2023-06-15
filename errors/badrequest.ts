import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-error";

export class BadRequestError extends CustomApiError {
  public status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;
  }
}
