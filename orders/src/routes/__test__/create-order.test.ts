import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { generateRandomId, signin } from "../../test/helpers";
import request from "supertest";

it("should return 401 when trying to create order with not signed in user", async () => {
  await request(app)
    .post("/api/orders")
    .send({
      ticketId: generateRandomId(),
    })
    .expect(401);
});

it("should return 404 when trying to order non existing ticket", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({
      ticketId: generateRandomId(),
    })
    .expect(404);
});

it("should return 400 when the ticketId is not valid", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({
      ticketId: "123",
    })
    .expect(400);
});

it("should return an error if the ticket is already reserved", async () => {
  const userId = generateRandomId();
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + 15 * 60);

  const ticket = Ticket.build({
    price: 500,
    title: "new title",
  });
  await ticket.save();

  const order = Order.build({
    userId,
    expiresAt,
    status: OrderStatus.Completed,
    ticket,
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin(userId))
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("should create new order", async () => {
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + 15 * 60);
  const ticket = Ticket.build({
    price: 500,
    title: "new title",
  });
  await ticket.save();

  const previousOrders = await Order.find({});
  expect(previousOrders.length).toEqual(0);

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const nowOrders = await Order.find({});
  expect(nowOrders.length).toEqual(1);
});

it.todo("should emit an event when the order is created");
