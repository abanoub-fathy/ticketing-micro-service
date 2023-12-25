import { CustomError, ErrResponse } from "./custom-error";

export class UnAuthenticatedError extends CustomError {
  statusCode = 401;

  constructor(msg: string) {
    super("unauthenticated error");

    Object.setPrototypeOf(this, UnAuthenticatedError.prototype);
  }

  serializeErrors(): ErrResponse[] {
    return [{ message: "please login to continue" }];
  }
}
