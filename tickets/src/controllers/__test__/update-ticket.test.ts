import request from "supertest";
import { app } from "../../app";
import { generateRandomId, saveTicket, signin } from "../../test/helpers";
import { Ticket } from "../../models/ticket";
import natsWrapper from "../../nats-client-wrapper";

it("should not allow unauthenticated user to update a ticket", async () => {
  const newTicket = await saveTicket();
  const updates = {
    title: "new title",
    price: 700,
  };

  await request(app)
    .put(`/api/tickets/${newTicket.id}`)
    .send(updates)
    .expect(401);
});

it("should return 404 when the ticket does not exist", async () => {
  await request(app)
    .put(`/api/tickets/${generateRandomId()}`)
    .set("Cookie", signin())
    .send({
      title: "new title",
      price: 1500,
    })
    .expect(404);
});

it("should return unauthenticated 401 status when the ticket does not belong to the same user", async () => {
  const newTicket = await saveTicket({
    title: "title 1",
    price: 475,
    userId: generateRandomId(),
  });

  await request(app)
    .put(`/api/tickets/${newTicket.id}`)
    .set("Cookie", signin())
    .send({ title: "updated title", price: 500 })
    .expect(401);
});

it("should return 400 bad request when user enters invalid data", async () => {
  const newTicket = await saveTicket({
    title: "title 1",
    price: 475,
    userId: generateRandomId(),
  });

  await request(app)
    .put(`/api/tickets/${newTicket.id}`)
    .set("Cookie", signin())
    .send({ title: "updated title", price: -10 })
    .expect(400);
});

it("should update the ticket when user is authenticated and enters valid updates", async () => {
  const userId = generateRandomId();

  const ticket = await saveTicket({
    title: "golden ticket",
    price: 100,
    userId,
  });

  const updates = {
    title: "new title",
    price: 700,
  };

  const response = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", signin(userId))
    .send(updates);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(response.statusCode).toEqual(200);
  expect(updatedTicket?.title).toEqual(updates.title);
  expect(updatedTicket?.price).toEqual(updates.price);
});

it("should invoke event fn when updating event", async () => {
  const userId = generateRandomId();

  const ticket = await saveTicket({
    title: "golden ticket",
    price: 100,
    userId,
  });

  const updates = {
    title: "new title",
    price: 700,
  };

  const response = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", signin(userId))
    .send(updates);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("should not allow update the ticket when it is reserved", async () => {
  const userId = generateRandomId();

  const ticket = await saveTicket({
    title: "golden ticket",
    price: 100,
    userId,
  });
  // assign orderId to the ticket (that means it is reserved)
  ticket.orderId = generateRandomId();
  await ticket.save();

  const updates = {
    title: "new title",
    price: 700,
  };

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", signin(userId))
    .send(updates)
    .expect(400);
});
