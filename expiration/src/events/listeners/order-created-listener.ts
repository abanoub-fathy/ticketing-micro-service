import { Listener, OrderCreatedEvent, Subjects } from "@ticketiano/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage(data: OrderCreatedEvent["data"], msg: Message): void {
    // TODO: write the business logic for this listener

    // ack the msg
    msg.ack();
  }
}
