import { Redis } from 'ioredis'
import { config } from './config.js';

const db = new Redis({
    host: "127.0.0.1",
    port: 6379,
    retryStrategy(times) {
        if (config.IS_DEVELOPMENT) {
            console.log("REDIS_ERROR: Could not connect to DB")
            return null;
        } else {
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    },
});

export async function getJSON(key, path="", expire=config.DEFAULT_EXPIRATION) {
    let res = await db.call("JSON.GET", key, "$" + path);
    if (res && expire != 0) {
        await db.call("EXPIRE", key, expire);
    }
    return res;
}

export async function setJSON(key, value, path="", expire=config.DEFAULT_EXPIRATION) {
    let res = await db.call("JSON.SET", key, "$" + path, value);
    if (res) {
        await db.call("EXPIRE", key, expire);
    }
    return res;
}

export async function arrappendJSON(key, value, path="", expire=config.DEFAULT_EXPIRATION, ...values) {
    let res = await db.call("JSON.ARRAPPEND", key, "$" + path, value, ...values);
    if (res) {
        await db.call("EXPIRE", key, expire);
    }
    return res;
}

export default db;