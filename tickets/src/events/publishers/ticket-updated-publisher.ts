import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketiano/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
