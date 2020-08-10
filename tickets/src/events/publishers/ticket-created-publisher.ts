import { Publisher, Subjects, TicketCreatedEvent } from '@jjtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
