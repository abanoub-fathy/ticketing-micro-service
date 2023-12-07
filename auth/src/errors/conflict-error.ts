import { CustomError, ErrResponse } from "./custom-error";

export class ConflictError extends CustomError {
  statusCode = 409;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors(): ErrResponse[] {
    return [{ message: this.message }];
  }
}
