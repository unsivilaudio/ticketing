import { Publisher, OrderCancelledEvent, Subjects } from '@jjtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
