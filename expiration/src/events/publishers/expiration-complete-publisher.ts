import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
} from '@jjtickets/common';

export class ExpirationCompletePublisher extends Publisher<
    ExpirationCompleteEvent
> {
    readonly subject = Subjects.ExpirationComplete;
}
