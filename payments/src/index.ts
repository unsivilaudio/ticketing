import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
    console.log('[payments] Starting Up.....');
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('Mongo DB not defined');
    }
    if (
        !process.env.NATS_CLUSTER_ID ||
        !process.env.NATS_CLIENT_ID ||
        !process.env.NATS_URL
    ) {
        throw new Error('NATS config not defined');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        process.on('SIGINT', () => {
            natsWrapper.client.close();
        });
        process.on('SIGTERM', () => {
            natsWrapper.client.close();
        });
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('[Payments] Connected to DB.');
    } catch (e) {
        console.log(e);
    }
    app.listen(3000, () =>
        console.log('[Payments] Listening on port 3000!!!!')
    );
};

start();
