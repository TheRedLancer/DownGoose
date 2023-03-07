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
    ALLOWED_HOSTS: ["http://localhost:5173", "https://admin.socket.io"],
    DEFAULT_EXPIRATION: 3600,
    ROOM_EXPIRATION: 60 * 60 * 24 * 7 // one week
}