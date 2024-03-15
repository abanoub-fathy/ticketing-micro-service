import { OrderCreatedEvent, OrderStatus } from "@ticketiano/common";
import natsClientWrapper from "../../../nats-client-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";
import { generateRandomId } from "../../../test/helpers";
import { Order } from "../../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsClientWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: generateRandomId(),
    userId: generateRandomId(),
    version: 0,
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    ticket: {
      id: generateRandomId(),
      price: 100,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("payment service listen to order created event", () => {
  it("should create new order", async () => {
    const { listener, msg, data } = await setup();
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);
    expect(order).toBeDefined();
    expect(order!.id).toEqual(data.id);
    expect(order!.version).toEqual(data.version);
    expect(order!.price).toEqual(data.ticket.price);
  });

  it("should ack the msg", async () => {
    const { listener, msg, data } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
});
