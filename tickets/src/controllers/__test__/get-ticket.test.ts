import request from "supertest";
import { app } from "../../app";
import { generateRandomId, saveTicket } from "../../test/helpers";

it("should return 404 when there is not ticket with specified id", async () => {
  const randomId = generateRandomId();
  const url = `/api/tickets/${randomId}`;
  await request(app).get(url).send().expect(404);
});

it("should return ticket when it exists", async () => {
  // create ticket in db
  const ticketAttrs = {
    title: "golden ticket",
    price: 200,
    userId: generateRandomId(),
  };
  const createdTicket = await saveTicket(ticketAttrs);

  // get the ticket from db by id
  const url = `/api/tickets/${createdTicket.id}`;
  const response = await request(app).get(url).send();

  expect(response.statusCode).toEqual(200);
  expect(response.body.title).toEqual(ticketAttrs.title);
  expect(response.body.price).toEqual(ticketAttrs.price);
  expect(response.body.userId).toEqual(ticketAttrs.userId);
});
