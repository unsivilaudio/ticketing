import { Publisher, Subjects, TicketUpdatedEvent } from '@jjtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
