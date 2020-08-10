import { Subjects, Publisher, PaymentCompletedEvent } from '@jjtickets/common';

export class PaymentCompletedPublisher extends Publisher<
    PaymentCompletedEvent
> {
    readonly subject = Subjects.PaymentCompleted;
}
