import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('Mongo DB not defined');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('[auth] Connected to DB.');
    } catch (e) {
        console.log(e);
    }
    app.listen(3000, () => console.log('[auth] Listening on port 3000!!!!'));
};

start();
