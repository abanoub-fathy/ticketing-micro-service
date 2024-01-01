import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Ticket, TicketAttrs, TicketDoc } from "../models/ticket";

export const signin = (id: string = generateRandomId()) => {
  // create jwt token with email and id as payload
  const payload = { id, email: "test@test.com" };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);

  // create session object
  const session = {
    token,
  };

  // encode to base64
  const endcodedSession = Buffer.from(JSON.stringify(session)).toString(
    "base64"
  );

  // return the cookie string
  return [`session=${endcodedSession}; path=/; httponly`];
};

export const generateRandomId = (): string => {
  return new mongoose.Types.ObjectId().toHexString();
};

export const saveTicket = async (
  attrs: TicketAttrs = {
    title: "new title",
    price: 500,
    userId: generateRandomId(),
  }
): Promise<TicketDoc> => {
  return Ticket.build(attrs).save();
};
