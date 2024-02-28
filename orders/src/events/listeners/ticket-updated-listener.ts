import { Listener, Subjects, TicketUpdatedEvent } from "@ticketiano/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { title, price } = data;

    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error("ticket not found");
    }

    ticket.title = title;
    ticket.price = price;
    await ticket.save();

    msg.ack();
  }
}
