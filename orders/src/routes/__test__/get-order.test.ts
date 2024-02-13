import request from "supertest";
import { app } from "../../app";
import {
  generateRandomId,
  saveOrder,
  saveTicket,
  signin,
} from "../../test/helpers";

it("should return 401 when trying to get order if the user is not authenticated", async () => {
  const orderId = generateRandomId();
  await request(app).get(`/api/orders/${orderId}`).expect(401);
});

it("should return 400 when the orderId is not valid mongoId", async () => {
  const orderId = "123xyz";
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", signin())
    .expect(400);
});

it("should return 404 when the order does not exist", async () => {
  const orderId = generateRandomId();
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", signin())
    .expect(404);
});

it("should return only user order when it is requested", async () => {
  const userOneId = generateRandomId();
  const ticketOne = await saveTicket();
  const orderOne = await saveOrder(userOneId, ticketOne);

  const userTwoId = generateRandomId();
  const ticketTwo = await saveTicket();
  const orderTwo = await saveOrder(userTwoId, ticketTwo);

  let response = await request(app)
    .get(`/api/orders/${orderOne.id}`)
    .set("Cookie", signin(userOneId))
    .expect(200);
  expect(response.body.id).toEqual(orderOne.id);
  expect(response.body.ticket.id).toEqual(ticketOne.id);

  response = await request(app)
    .get(`/api/orders/${orderTwo.id}`)
    .set("Cookie", signin(userOneId))
    .expect(401);
});
