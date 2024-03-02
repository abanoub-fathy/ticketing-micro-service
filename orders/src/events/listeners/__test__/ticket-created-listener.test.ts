import { TicketCreatedEvent } from "@ticketiano/common";
import { generateRandomId } from "../../../test/helpers";
import { Message } from "node-nats-streaming";
import { TicketCreatedListener } from "../ticket-created-listener";
import natsClientWrapper from "../../../nats-client-wrapper";
import { Ticket } from "../../../models/ticket";

describe("ticket created listener", () => {
  const listener = new TicketCreatedListener(natsClientWrapper.client);
  const ticketId = generateRandomId();

  const data: TicketCreatedEvent["data"] = {
    id: ticketId,
    version: 0,
    userId: generateRandomId(),
    price: 700,
    title: "new ticket",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  it("should create a new ticket", async () => {
    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(ticketId);
    expect(ticket).not.toBeNull();
    expect(ticket?.version).toEqual(0);
  });

  it("should call the ack function", async () => {
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
});
