import dotenv from 'dotenv';
dotenv.config();

function getDefault<T>(value: T | undefined, defaultValue: T): T {
    if (!value || value === 'undefined') {
        return defaultValue;
    }
    return value;
}

function addPortToAllowedHosts(endpoints: string[], ports: number[]) {
    let out: string[] = [];
    for (const ep of endpoints) {
        for (const port of ports) {
            out.push(ep + ':' + port);
        }
        out.push(ep);
    }
    return out;
}

const ENDPOINTS = [
    getDefault(process.env.URL, 'localhost'),
    '127.0.0.1',
    'https://admin.socket.io',
];

export const config: any = {
    IS_DEVELOPMENT:
        getDefault(process.env.NODE_ENV, 'development') !== 'production',
    DEFAULT_MAX_PLAYERS: 14,
    DEFAULT_EXPIRATION: 60 * 3,
    HOUR_EXPIRATION: 60 * 60, // one hour
    SERVER_PORT: getDefault(process.env.SERVER_PORT, '3000'),
    ALLOWED_HOSTS: addPortToAllowedHosts(ENDPOINTS, [3000, 5173]),
    REDIS_HOSTNAME: getDefault(process.env.REDIS_URL, 'localhost'),
    REDIS_PORT: getDefault(process.env.REDIS_PORT, '18346'),
    REDIS_USER: 'default',
    REDIS_PASS: getDefault(process.env.REDIS_PASS, ''),
};
