import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@jjtickets/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queues';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting this long (ms) to process job: ' + delay);
        await expirationQueue.add(
            {
                orderId: data.id,
            },
            {
                delay,
            }
        );

        msg.ack();
    }
}
