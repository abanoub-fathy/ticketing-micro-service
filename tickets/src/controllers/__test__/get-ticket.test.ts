import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

it("should return 404 when there is not ticket with specified id", async () => {
  const randomId = new mongoose.Types.ObjectId();
  const url = `/api/tickets/${randomId}`;
  await request(app).get(url).send().expect(404);
});

it("should return ticket when it exists", async () => {
  // create ticket in db
  const ticketAttrs = {
    title: "golden ticket",
    price: 200,
    userId: new mongoose.Types.ObjectId().toString(),
  };
  const createdTicket = await Ticket.build(ticketAttrs).save();

  // get the ticket from db by id
  const url = `/api/tickets/${createdTicket.id}`;
  const response = await request(app).get(url).send();

  expect(response.statusCode).toEqual(200);
  expect(response.body.title).toEqual(ticketAttrs.title);
  expect(response.body.price).toEqual(ticketAttrs.price);
  expect(response.body.userId).toEqual(ticketAttrs.userId);
});
