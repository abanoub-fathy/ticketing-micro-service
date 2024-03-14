import {
  OrderExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@ticketiano/common";

export class OrderExpirationCompletePublisher extends Publisher<OrderExpirationCompleteEvent> {
  readonly subject = Subjects.OrderExpirationComplete;
}
