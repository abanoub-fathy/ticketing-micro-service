import request from "supertest";
import { app } from "../../app";
import {
  generateRandomId,
  saveOrder,
  saveTicket,
  signin,
} from "../../test/helpers";
import { Order, OrderStatus } from "../../models/order";
import natsClientWrapper from "../../nats-client-wrapper";

it("should return 401 when trying to delet order if the user is not authenticated", async () => {
  const orderId = generateRandomId();
  await request(app).delete(`/api/orders/${orderId}`).expect(401);
});

it("should return 400 when the orderId is not valid mongoId", async () => {
  const orderId = "123xyz";
  await request(app)
    .delete(`/api/orders/${orderId}`)
    .set("Cookie", signin())
    .expect(400);
});

it("should return 404 when the order does not exist", async () => {
  const orderId = generateRandomId();
  await request(app)
    .delete(`/api/orders/${orderId}`)
    .set("Cookie", signin())
    .expect(404);
});

it("should delet only user order when it is requested", async () => {
  const userOneId = generateRandomId();
  const ticketOne = await saveTicket();
  const orderOne = await saveOrder(userOneId, ticketOne);

  const userTwoId = generateRandomId();
  const ticketTwo = await saveTicket();
  const orderTwo = await saveOrder(userTwoId, ticketTwo);

  let response = await request(app)
    .delete(`/api/orders/${orderOne.id}`)
    .set("Cookie", signin(userOneId))
    .expect(204);

  let deletedOrder = await Order.findById(orderOne.id);
  expect(deletedOrder?.status).toEqual(OrderStatus.Cancelled);

  response = await request(app)
    .delete(`/api/orders/${orderTwo.id}`)
    .set("Cookie", signin(userOneId))
    .expect(401);
});

it("should emit an event when the order is deleted", async () => {
  const userId = generateRandomId();
  const ticket = await saveTicket();
  const order = await saveOrder(userId, ticket);
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", signin(userId))
    .expect(204);

  expect(natsClientWrapper.client.publish).toHaveBeenCalled();
});
