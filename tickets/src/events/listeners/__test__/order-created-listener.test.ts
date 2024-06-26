import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  TicketUpdatedEvent,
} from "@ticketiano/common";
import { generateRandomId } from "../../../test/helpers";
import natsClientWrapper from "../../../nats-client-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setupTest = async () => {
  const userId = generateRandomId();

  // create a ticket with a new order
  const ticket = await Ticket.build({
    title: "title 1",
    price: 400,
    userId,
  });
  ticket.orderId = generateRandomId();
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: generateRandomId(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  const listener = new OrderCancelledListener(natsClientWrapper.client);

  return { ticket, listener, data, msg };
};

describe("listen to order cancelled", () => {
  it("should update the ticket and remove the orderId", async () => {
    const { ticket, listener, data, msg } = await setupTest();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(data.ticket.id);

    expect(updatedTicket!.version).toEqual(ticket.version + 1);
    expect(updatedTicket!.orderId).toBeUndefined();
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
    expect(eventData.orderId).toEqual(undefined);
  });
});
