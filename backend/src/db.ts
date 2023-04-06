import {createClient} from 'redis';
import {Repository} from 'redis-om';
import * as SCHEMAS from './schemas.js';
import {config} from './config.js';

const redis = createClient({
    password: config.REDIS_PASS,
    socket: {
        host: config.REDIS_HOSTNAME,
        port: config.REDIS_PORT,
    },
});

export const roomRepo = new Repository(SCHEMAS.gameRoomSchema, redis);
export const playerRepo = new Repository(SCHEMAS.playerSchema, redis);

export async function createIndices() {
    await playerRepo.createIndex();
    await roomRepo.createIndex();
}

export async function getDB() {
    if (!redis.isReady) {
        await redis.connect();
    }
    return redis;
}
