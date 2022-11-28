import axios from 'axios';
import https from 'https';

function onRequestError(err) {
    console.log('API Error: ', err.message);
    return Promise.reject(err);
}

const buildClient = ({ req }) => {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });

    let instance = axios.create({ httpsAgent });
    if (typeof window === 'undefined') {
        instance.defaults.baseURL = 'http://tix.dev';
        instance.defaults.headers.common['Host'] = 'tix.dev';
    }
    if (req) {
        instance.defaults.headers = req.headers;
    }

    instance.interceptors.request.use(null, onRequestError);

    return instance;
};

export default buildClient;
