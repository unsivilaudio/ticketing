import { Message } from 'node-nats-streaming';
import {
    Listener,
    PaymentCompletedEvent,
    Subjects,
    OrderStatus,
} from '@jjtickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCompletedListener extends Listener<PaymentCompletedEvent> {
    readonly subject = Subjects.PaymentCompleted;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCompletedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) throw new Error('Order not found.');

        order.set({ status: OrderStatus.Complete });
        await order.save();

        msg.ack();
    }
}
