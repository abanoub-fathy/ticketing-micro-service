import { Listener, OrderCancelledEvent, Subjects } from "@ticketiano/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // get the ticket by id
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("ticket not found");
    }

    // unset orderId
    ticket.set("orderId", undefined);

    // save the ticket
    await ticket.save();

    // publish ticket updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // acknowledge the event
    msg.ack();
  }
}
