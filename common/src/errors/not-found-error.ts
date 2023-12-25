import { CustomError, ErrResponse } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("resource is not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): ErrResponse[] {
    return [{ message: "resource is not found" }];
  }
}
