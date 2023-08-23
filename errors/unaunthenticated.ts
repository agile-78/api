import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./customError";

export class UnAuthenticatedError extends CustomApiError {
  public status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}
