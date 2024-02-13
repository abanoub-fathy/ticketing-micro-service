import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Ticket, TicketDoc } from "../models/ticket";
import { Order, OrderDoc, OrderStatus } from "../models/order";

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

export const saveTicket = async (): Promise<TicketDoc> => {
  const ticket = Ticket.build({
    title: "concert",
    price: 10,
  });

  await ticket.save();
  return ticket;
};

export const saveOrder = async (
  userId: string,
  ticket: TicketDoc
): Promise<OrderDoc> => {
  const timeToExpire = new Date();
  timeToExpire.setSeconds(timeToExpire.getSeconds() + 15 * 60 * 60);

  const order = Order.build({
    status: OrderStatus.Created,
    expiresAt: timeToExpire,
    ticket,
    userId,
  });

  await order.save();
  return order;
};
