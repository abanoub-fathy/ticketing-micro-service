import { Request, Response, NextFunction } from "express";
import { UnAuthenticatedError } from "../errors/unauthenticated-error";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new UnAuthenticatedError("please login to continue");
  }

  next();
};
