import { OrderCancelledEvent, Publisher, Subjects } from "@ticketiano/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
