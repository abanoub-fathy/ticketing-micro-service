import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@ticketiano/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("could not find the order");
    }

    order.status = OrderStatus.Completed;
    await order.save();

    msg.ack();
  }
}
