import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

interface UserPayload {
  id: string;
  email: string;
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get the session from req
  if (!req.session?.token) {
    return next();
  }

  try {
    // verify the token
    const payload = jwt.verify(
      req.session.token,
      process.env.JWT_SECRET_KEY!
    ) as UserPayload;

    // set the user in the req
    req.currentUser = payload;
  } catch (err) {}

  next();
};
