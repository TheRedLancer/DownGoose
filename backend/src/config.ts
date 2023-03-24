import dotenv from 'dotenv';
dotenv.config();

function getDefault<T>(value: T, defaultValue: T) {
    if (!value || value === 'undefined') {
        return defaultValue;
    }
  
    return value;
}

export const config = {
    IS_DEVELOPMENT: getDefault(process.env.NODE_ENV, 'development') !== 'production',
    DEFAULT_MAX_PLAYERS: 14,
    ALLOWED_HOSTS: [ 
        "http://localhost:3000","http://127.0.0.1:3000",
        "http://localhost:5173","http://127.0.0.1:5173",
        "https://admin.socket.io"
    ],
    DEFAULT_EXPIRATION: 60 * 3,
    HOUR_EXPIRATION: 60 * 60, // one hour
    SERVER_PORT: 3000,
    SOCKET_PORT: 8000,
    REDIS_HOSTNAME: 'redis-18346.c285.us-west-2-2.ec2.cloud.redislabs.com',
    REDIS_PORT: 18346,
    REDIS_USER:"default",
    REDIS_PASS: getDefault(process.env.REDIS_PASS, ""),

}