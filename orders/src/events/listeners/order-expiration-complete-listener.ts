import {
  Listener,
  OrderExpirationCompleteEvent,
  OrderStatus,
  Subjects,
} from "@ticketiano/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class OrderExpirationCompleteListener extends Listener<OrderExpirationCompleteEvent> {
  readonly subject = Subjects.OrderExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("order not found");
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publish event order canelled
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
