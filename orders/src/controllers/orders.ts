import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from "@ticketiano/common";
import { Order } from "../models/order";

export const getAllOrders = async (req: Request, res: Response) => {
  res.send({});
};

export const getOrder = async (req: Request, res: Response) => {
  res.send({});
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

  // create new order

  // return response
};

export const deleteOrder = async (req: Request, res: Response) => {
  res.send({});
};
