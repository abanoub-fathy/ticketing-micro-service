import { CustomError, ErrResponse } from "./custom-error";

class DatabaseConnectionError extends CustomError {
  reason = "could not connect to database";
  statusCode = 500;
  constructor() {
    super("");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): ErrResponse[] {
    return [{ message: this.reason }];
  }
}

export { DatabaseConnectionError };
