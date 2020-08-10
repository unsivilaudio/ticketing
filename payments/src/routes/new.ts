import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus,
    BadRequestError,
} from '@jjtickets/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCompletedPublisher } from '../events/publishers/payment-completed-event';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/payments',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty()
            .withMessage('Invalid or missing payment token provided'),
        body('orderId')
            .not()
            .isEmpty()
            .withMessage('You must supply an order id.'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) throw new NotFoundError();
        if (order.userId !== req.currentUser!.id)
            throw new NotAuthorizedError();
        if (order.status === OrderStatus.Cancelled)
            throw new BadRequestError(
                'Cannot pay for an expired or cancelled order'
            );
        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token,
        });

        const payment = Payment.build({
            orderId,
            stripeId: charge.id,
        });
        await payment.save();
        await new PaymentCompletedPublisher(natsWrapper.client).publish({
            id: payment.id,
            stripeId: payment.stripeId,
            orderId: payment.orderId,
        });

        res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };
