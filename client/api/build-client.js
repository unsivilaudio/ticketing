import axios from 'axios';
import https from 'https';

const buildClient = ({ req }) => {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });

    let instance = axios.create({ httpsAgent });
    if (typeof window === 'undefined') {
        instance.defaults.baseURL = 'http://www.alpha-server.xyz';
        // instance.defaults.baseURL = 'http://192.168.11.230';
        // instance.defaults.headers.common['Host'] = 'tix.dev';
    }
    if (req) {
        instance.defaults.headers = req.headers;
    }

    return instance;
};

export default buildClient;
