import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "@ticketiano/common";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import nats from "../nats-client-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

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
    version: ticket.version,
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
  // fetch only the available ticket that can be bought
  const tickets = await Ticket.find({ orderId: undefined });
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

  if (ticket.orderId) {
    throw new BadRequestError("could not update a reserved ticket");
  }

  if (req.body.title) {
    ticket.title = req.body.title;
  }

  if (req.body.price) {
    ticket.price = req.body.price;
  }

  await ticket.save();

  await new TicketUpdatedPublisher(nats.client).publish({
    id: ticket.id,
    version: ticket.version,
    price: ticket.price,
    title: ticket.title,
    userId: ticket.userId,
  });

  res.status(200).json(ticket);
};
