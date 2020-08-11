import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
    console.log('[expiration] Starting Up.....');
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
    } catch (e) {
        console.log(e);
    }
};

start();
