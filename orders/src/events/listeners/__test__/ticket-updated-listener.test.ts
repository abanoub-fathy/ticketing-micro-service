import { TicketUpdatedEvent } from "@ticketiano/common";
import { generateRandomId } from "../../../test/helpers";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import natsClientWrapper from "../../../nats-client-wrapper";

const setupTest = () => {
  const listener = new TicketUpdatedListener(natsClientWrapper.client);
  const ticketId = generateRandomId();

  const ticket = Ticket.build({
    id: ticketId,
    price: 400,
    title: "initial title",
  });

  const data: TicketUpdatedEvent["data"] = {
    id: ticketId,
    version: 1,
    userId: generateRandomId(),
    title: "updated title",
    price: 200,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

describe("successful ticket updated listener", () => {
  it("should update the ticket", async () => {
    const { ticket, data, listener, msg } = setupTest();

    await ticket.save();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.version).toEqual(data.version);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
  });

  it("should call ack func", async () => {
    const { ticket, data, listener, msg } = setupTest();
    await ticket.save();
    await listener.onMessage(data, msg);
    await Ticket.findById(ticket.id);

    expect(msg.ack).toHaveBeenCalled();
  });
});

it("should not call ack when the events are out of order", async () => {
  const { ticket, data, listener, msg } = setupTest();
  await ticket.save();

  // making the ticket out of order
  data.version += 1;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
