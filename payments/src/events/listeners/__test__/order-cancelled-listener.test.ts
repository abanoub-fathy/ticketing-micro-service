import { OrderCancelledEvent, OrderStatus } from "@ticketiano/common";
import natsClientWrapper from "../../../nats-client-wrapper";
import { Message } from "node-nats-streaming";
import { generateRandomId } from "../../../test/helpers";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsClientWrapper.client);

  const order = Order.build({
    id: generateRandomId(),
    status: OrderStatus.Created,
    price: 100,
    userId: generateRandomId(),
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: generateRandomId(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("payment service listen to order cancelled event", () => {
  it("should cancel the order", async () => {
    const { listener, msg, data } = await setup();
    let order = await Order.findById(data.id);
    expect(order).toBeDefined();
    expect(order!.status).toEqual(OrderStatus.Created);
    expect(order!.version).toEqual(data.version - 1);

    await listener.onMessage(data, msg);

    order = await Order.findById(data.id);
    expect(order).toBeDefined();
    expect(order!.status).toEqual(OrderStatus.Cancelled);
    expect(order!.version).toEqual(data.version);
  });

  it("should ack the msg", async () => {
    const { listener, msg, data } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
});
