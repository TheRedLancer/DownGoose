import { Redis } from 'ioredis'
import { createClient } from 'redis'
import { Repository } from 'redis-om'
import * as SCHEMAS from './schemas.js'
import { config } from './config.js';

// const db = new Redis({
//     host: "127.0.0.1",
//     port: 6379,
//     retryStrategy(times) {
//         if (config.IS_DEVELOPMENT) {
//             console.log("REDIS_ERROR: Could not connect to DB")
//             return null;
//         } else {
//             const delay = Math.min(times * 50, 2000);
//             return delay;
//         }
//     },
// });

import { createClient } from 'redis'

const redis = createClient({
    url: 'redis://127.0.0.1:6379'
})
redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect()
console.log(await redis.ping());

const gameRoomRepo = new Repository(SCHEMAS.gameRoomSchema, redis)
const playerRepo = new Repository(SCHEMAS.playerSchema, redis)


// export async function getJSON(key, path="", expire=config.DEFAULT_EXPIRATION) {
//     let res = await db.call("JSON.GET", key, "$" + path);
//     if (res && expire != 0) {
//         await db.call("EXPIRE", key, expire);
//     }
//     return res;
// }

// export async function setJSON(key, value, path="", expire=config.DEFAULT_EXPIRATION) {
//     let res = await db.call("JSON.SET", key, "$" + path, value);
//     if (res) {
//         await db.call("EXPIRE", key, expire);
//     }
//     return res;
// }

// export async function arrappendJSON(key, value, path="", expire=config.DEFAULT_EXPIRATION, ...values) {
//     let res = await db.call("JSON.ARRAPPEND", key, "$" + path, value, ...values);
//     if (res) {
//         await db.call("EXPIRE", key, expire);
//     }
//     return res;
// }

export default redis;