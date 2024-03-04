import {
  OrderCreatedEvent,
  OrderStatus,
  TicketUpdatedEvent,
} from "@ticketiano/common";
import { generateRandomId } from "../../../test/helpers";
import { OrderCreatedListener } from "../order-created-listener";
import natsClientWrapper from "../../../nats-client-wrapper";
import { Ticket } from "../../../models/ticket";

const setupTest = async () => {
  const userId = generateRandomId();

  const ticket = await Ticket.build({
    title: "title 1",
    price: 400,
    userId,
  }).save();

  const data: OrderCreatedEvent["data"] = {
    id: generateRandomId(),
    status: OrderStatus.Created,
    userId: generateRandomId(),
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  const listener = new OrderCreatedListener(natsClientWrapper.client);

  return { ticket, listener, data, msg };
};

describe("successful order created event listener", () => {
  it("should update the ticket", async () => {
    const { ticket, listener, data, msg } = await setupTest();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(data.ticket.id);

    expect(updatedTicket!.version).toEqual(ticket.version + 1);
    expect(updatedTicket!.orderId).toEqual(data.id);
  });

  it("should call ack function", async () => {
    const { ticket, listener, data, msg } = await setupTest();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });

  it("should publsih ticket updated event", async () => {
    const { ticket, listener, data, msg } = await setupTest();
    await listener.onMessage(data, msg);

    expect(natsClientWrapper.client.publish).toHaveBeenCalled();
    const eventData: TicketUpdatedEvent["data"] = JSON.parse(
      (natsClientWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(ticket.id);
    expect(eventData.orderId).toEqual(data.id);
  });
});
