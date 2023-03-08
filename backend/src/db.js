import { Redis } from 'ioredis'
import { config } from './config.js';

const db = new Redis({
    host: "127.0.0.1",
    port: 6379,
});

export async function getJSON(key, path="$", expire=config.DEFAULT_EXPIRATION) {
    let res = await db.call("JSON.GET", key, path);
    if (res && expire != 0) {
        await db.call("EXPIRE", key, expire);
    }
    return res;
}

export async function setJSON(key, value, path="$", expire=config.DEFAULT_EXPIRATION) {
    let res = await db.call("JSON.SET", key, path, value);
    if (res) {
        await db.call("EXPIRE", key, expire);
    }
    return res;
}

export default db;