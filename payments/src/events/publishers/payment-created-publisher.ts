import { Publisher, PaymentCreatedEvent, Subjects } from "@ticketiano/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
