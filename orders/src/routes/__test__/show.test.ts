import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
    });
    await ticket.save();
    return ticket;
};

it('fetches an order', async () => {
    const ticket = await buildTicket();

    const user = global.signin();
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(response.body.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another order', async () => {
    const ticket = await buildTicket();

    const user = global.signin();
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
});
