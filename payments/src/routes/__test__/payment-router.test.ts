import request = require("supertest");
import { app } from "../../app";
import { generateRandomId, signin } from "../../test/helpers";
import { Order } from "../../models/order";
import { OrderStatus } from "@ticketiano/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

describe("create a payment failure case", () => {
  const url = "/api/payments";

  it("should return 404 when creating payment on non-existing order", async () => {
    await request(app)
      .post(url)
      .set("Cookie", signin())
      .send({
        orderId: generateRandomId(),
        token: "tok_hsjdhsjz45s4",
      })
      .expect(404);
  });

  it("should return 401 when pay order not belong to the same user", async () => {
    const order = await Order.build({
      id: generateRandomId(),
      userId: generateRandomId(),
      price: 100,
      version: 0,
      status: OrderStatus.Created,
    }).save();

    await request(app)
      .post(url)
      .set("Cookie", signin())
      .send({
        orderId: order.id,
        token: "tok_hsjdhsjz45s4",
      })
      .expect(401);
  });

  it("should return 400 when trying to pay for cancelled order", async () => {
    const order = await Order.build({
      id: generateRandomId(),
      userId: generateRandomId(),
      price: 100,
      version: 0,
      status: OrderStatus.Created,
    }).save();

    order.status = OrderStatus.Cancelled;
    await order.save();

    await request(app)
      .post(url)
      .set("Cookie", signin(order.userId))
      .send({
        orderId: order.id,
        token: "tok_hsjdhsjz45s4",
      })
      .expect(400);
  });
});

describe("create a payment successful case", () => {
  const url = "/api/payments";
  const validStripeToken = "tok_visa";

  it("should return 201", async () => {
    const order = await Order.build({
      id: generateRandomId(),
      userId: generateRandomId(),
      price: 100,
      version: 0,
      status: OrderStatus.Created,
    }).save();

    await request(app)
      .post(url)
      .set("Cookie", signin(order.userId))
      .send({
        orderId: order.id,
        token: validStripeToken,
      })
      .expect(201);
  });

  it("should call the stripe create charge method", async () => {
    const order = await Order.build({
      id: generateRandomId(),
      userId: generateRandomId(),
      price: 100,
      version: 0,
      status: OrderStatus.Created,
    }).save();

    await request(app)
      .post(url)
      .set("Cookie", signin(order.userId))
      .send({
        orderId: order.id,
        token: validStripeToken,
      })
      .expect(201);

    const args = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(args.currency).toEqual("usd");
    expect(args.amount).toEqual(order.price * 100);
    expect(args.source).toEqual(validStripeToken);

    expect(stripe.charges.create).toHaveBeenCalled();
  });

  it("should create new payment object for the order", async () => {
    const order = await Order.build({
      id: generateRandomId(),
      userId: generateRandomId(),
      price: 100,
      version: 0,
      status: OrderStatus.Created,
    }).save();

    await request(app)
      .post(url)
      .set("Cookie", signin(order.userId))
      .send({
        orderId: order.id,
        token: validStripeToken,
      })
      .expect(201);

    const payment = await Payment.findOne({ orderId: order.id });
    console.log(payment);
    expect(payment).not.toBeNull();
  });
});
