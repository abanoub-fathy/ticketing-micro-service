import { Publisher, Subjects, TicketCreatedEvent } from "@ticketiano/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
