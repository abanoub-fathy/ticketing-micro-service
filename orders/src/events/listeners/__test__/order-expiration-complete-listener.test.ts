import {
  OrderCancelledEvent,
  OrderExpirationCompleteEvent,
} from "@ticketiano/common";
import { Order, OrderStatus } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { generateRandomId } from "../../../test/helpers";
import { OrderExpirationCompleteListener } from "../order-expiration-complete-listener";
import natsClientWrapper from "../../../nats-client-wrapper";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const ticket = Ticket.build({
    id: generateRandomId(),
    price: 100,
    title: "silver ticket",
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: generateRandomId(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  const data: OrderExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  const listener = new OrderExpirationCompleteListener(
    natsClientWrapper.client
  );

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, order, msg };
};

describe("listen to order expiration complete event", () => {
  it("should change the status of the order to be cancelled", async () => {
    const { data, listener, msg, ticket, order } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it("should publish an order cancelled event", async () => {
    const { data, listener, msg, ticket, order } = await setup();
    await listener.onMessage(data, msg);

    expect(natsClientWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse(
      (natsClientWrapper.client.publish as jest.Mock).mock.calls[0][1]
    ) as OrderCancelledEvent["data"];

    expect(eventData.id).toEqual(order.id);
  });

  it("should ack the msg", async () => {
    const { data, listener, msg, ticket, order } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
