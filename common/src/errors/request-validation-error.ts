import { ValidationError } from "express-validator";
import { CustomError, ErrResponse } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("validation error");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): ErrResponse[] {
    return this.errors.map((err) => {
      return {
        field: err.type === "field" ? err.path : "unknown field",
        message: err.msg,
      };
    });
  }
}
