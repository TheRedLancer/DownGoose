import { createClient } from 'redis'
import {Repository, EntityId} from 'redis-om';
import * as SCHEMAS from './schemas.js'
import { config } from './config.js';

const redis = createClient({
    password: config.REDIS_PASS,
    socket: {
        host: config.REDIS_HOSTNAME,
        port: config.REDIS_PORT
    }
});
//redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect();

export const roomRepo = new Repository(SCHEMAS.gameRoomSchema, redis);
await roomRepo.createIndex();
export const playerRepo = new Repository(SCHEMAS.playerSchema, redis);
await playerRepo.createIndex();

export default redis;