import dotenv from 'dotenv';
dotenv.config();

function getDefault<T>(value: (T | undefined), defaultValue: T): T {
    if (!value || value === 'undefined') {
        return defaultValue;
    }
    return value;
}

function addPortsToAllowedHosts(endpoints: string[], ports: number[]) {
    let out: string[] = [];
    for (const ep of endpoints) {
        for (const port of ports) {
            out.push(ep + ":" + port);
        }
    }
    return out;
}

const ENDPOINTS = [
    getDefault(process.env.URL, "http://localhost"),
    "http://127.0.0.1",
    "https://admin.socket.io"
]

export const config: any = {
    IS_DEVELOPMENT: getDefault(process.env.NODE_ENV, 'development') !== 'production',
    DEFAULT_MAX_PLAYERS: 14,
    DEFAULT_EXPIRATION: 60 * 3,
    HOUR_EXPIRATION: 60 * 60, // one hour
    SERVER_PORT: getDefault(process.env.SERVER_PORT, '3000'),
    SOCKET_PORT: getDefault(process.env.SOCKET_PORT, '8000'),
    ALLOWED_HOSTS: addPortsToAllowedHosts(ENDPOINTS, [3000, 8000]),
    REDIS_HOSTNAME: 'redis-18346.c285.us-west-2-2.ec2.cloud.redislabs.com',
    REDIS_PORT: getDefault(process.env.REDIS_PORT, '18346'),
    REDIS_USER:"default",
    REDIS_PASS: getDefault(process.env.REDIS_PASS, ""),
}