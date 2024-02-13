import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnAuthenticatedError,
} from "@ticketiano/common";
import { Order } from "../models/order";

const EXPIRATION_WINDOW = 15 * 60;

export const getAllOrders = async (req: Request, res: Response) => {
  const userOrders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.status(200).json(userOrders);
};

export const getOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthenticatedError("you are not allowed to see this resource");
  }

  res.status(200).json(order);
};

export const createOrder = async (req: Request, res: Response) => {
  // get ticket by id
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  // check the ticket is not reserved before
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError("the ticket is reserved before");
  }

  // calculate expirationDate
  let expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + EXPIRATION_WINDOW);

  // create new order
  const order = Order.build({
    userId: req.currentUser!.id,
    expiresAt: expirationDate,
    status: OrderStatus.Created,
    ticket,
  });

  await order.save();

  // return response
  res.status(201).json(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthenticatedError("you are not allowed to see this resource");
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // TODO: we need to publish an event for saying that the order is deleted/cancelled

  res.status(204).json(order);
};
