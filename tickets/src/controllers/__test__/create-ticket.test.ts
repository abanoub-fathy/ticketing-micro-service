import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/helpers";
import { Ticket } from "../../models/ticket";
import natsWrapper from "../../nats-client-wrapper";

it("should return a status code indicating there is an endpoint for creating tickets", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.statusCode).not.toEqual(400);
});

it("should return an error if the user is not authenticated", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("should not returning 401 unauthanticated if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({});

  expect(response.statusCode).not.toEqual(401);
});

it("should return an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("should return an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "asldkfj",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "laskdfj",
    })
    .expect(400);
});

it("should create new ticket record in db when request data is valid", async () => {
  // expect number of tickets to be zero
  let tickets = await Ticket.find();
  expect(tickets.length).toEqual(0);

  const body = {
    title: "golden ticket",
    price: 200,
  };

  // create ticket with the create request
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send(body)
    .expect(201);

  // expect number of tickets to be 1
  tickets = await Ticket.find();
  expect(tickets.length).toEqual(1);

  // expect the created ticket should have the same field as body
  expect(tickets[0].title).toEqual(body.title);
  expect(tickets[0].price).toEqual(body.price);
});

it("should invoke the client publish fn when creating new ticket", async () => {
  const body = {
    title: "golden ticket",
    price: 200,
  };

  // create ticket with the create request
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send(body)
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
