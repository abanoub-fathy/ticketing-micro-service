import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError, UnAuthenticatedError } from "@ticketiano/common";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import nats from "../nats-client-wrapper";

export const createTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id,
  });

  await ticket.save();

  await new TicketCreatedPublisher(nats.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
  });

  res.status(201).json(ticket);
};

export const getTicket = async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).json(ticket);
};

export const getAllTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find();
  res.status(200).json(tickets);
};

export const updateTicket = async (req: Request, res: Response) => {
  let ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new UnAuthenticatedError("the ticket does not belong to you");
  }

  if (req.body.title) {
    ticket.title = req.body.title;
  }

  if (req.body.price) {
    ticket.price = req.body.price;
  }

  await ticket.save();

  res.status(200).json(ticket);
};
