import { Subjects } from './subjects';

export interface PaymentCompletedEvent {
    subject: Subjects.PaymentCompleted;
    data: {
        id: string;
        orderId: string;
        stripeId: string;
    };
}
