// define customError abstract class
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): ErrResponse[];
}

export type ErrResponse = {
  message: string;
  field?: string;
};
