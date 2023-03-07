import dotenv from 'dotenv';
dotenv.config();

function getDefault(value, defaultValue) {
    if (!value || value === 'undefined') {
        return defaultValue;
    }
  
    return value;
}

export const config = {
    IS_DEVELOPMENT: getDefault(process.env.NODE_ENV, 'development') !== 'production',
    DEFAULT_MAX_PLAYERS: 14,
    ALLOWLIST_HOSTS: ["https://admin.socket.io", "http://127.0.0.1:5173"],
}