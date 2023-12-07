import { Request, Response } from "express";
import { User } from "../models/user";
import { ConflictError } from "../errors/conflict-error";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../utils/password";
import jwt from "jsonwebtoken";

export const getCurrentUser = (req: Request, res: Response) => {
  res.status(200).json({
    currentUser: req.currentUser || null,
  });
};

export const sigupUser = async (req: Request, res: Response) => {
  // destructure the body
  const { email, password } = req.body;

  // check if user with the same email exists
  const userWithSameEmail = await User.findOne({ email });
  if (userWithSameEmail) {
    throw new ConflictError("this email is already taken");
  }

  // build new user object
  const user = User.build({ email, password });

  // save user into the database
  await user.save();

  // gerate jwt token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET_KEY!
  );

  // save the token in the cookie
  req.session = {
    token,
  };

  // return new user object
  res.status(201).json({
    user,
  });
};

export const siginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("no user with this email");
  }

  const isPasswordCorrect = await Password.isCorrectPassword(
    password,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new BadRequestError("incorrect password");
  }

  // gerate jwt token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET_KEY!
  );

  // save the token in the cookie
  req.session = {
    token,
  };
  res.status(200).json(user);
};

export const signoutUser = (req: Request, res: Response) => {
  req.session = null;

  res.sendStatus(200);
};
