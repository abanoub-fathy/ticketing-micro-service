import { Listener, OrderCreatedEvent, Subjects } from "@ticketiano/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage(data: OrderCreatedEvent["data"], msg: Message): void {
    // add a job to the expiration queue
    expirationQueue.add({
      orderId: data.id,
    });

    // ack the msg
    msg.ack();
  }
}
