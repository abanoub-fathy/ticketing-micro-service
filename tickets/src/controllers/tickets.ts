import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@ticketiano/common";

export const createTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id,
  });

  await ticket.save();

  res.status(201).json(ticket);
};

export const getTicket = async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).json(ticket);
};
