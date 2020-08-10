import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, OrderCancelledEvent } from '@jjtickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        userId: mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
    });

    ticket.set({ orderId: orderId });
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        ticket: {
            id: ticket.id,
        },
        version: 0,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { orderId, listener, data, ticket, msg };
};

it('cancels a ticket reservation', async () => {
    const { orderId, listener, data, ticket, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
