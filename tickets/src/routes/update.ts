import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError,
    BadRequestError,
} from '@jjtickets/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title').not().notEmpty().withMessage('You must provide a Title'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('You must provide a price greater than zero'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) throw new NotFoundError();
        if (ticket.orderId)
            throw new BadRequestError('Cannot edit a reserved ticket.');
        if (req.currentUser!.id !== ticket.userId) {
            throw new NotAuthorizedError();
        }
        const { title, price } = req.body;
        ticket.set({ title, price });
        await ticket.save();

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket._id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });

        res.send(ticket);
    }
);

export { router as updateTicketRouter };
