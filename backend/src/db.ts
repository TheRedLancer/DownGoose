import { createClient } from 'redis'
import {Repository, EntityId} from 'redis-om';
import * as SCHEMAS from './schemas.js'
import { config } from './config.js';

const redis = createClient({
    password: config.REDIS_PASS,
    socket: {
        host: 'redis-10211.c285.us-west-2-2.ec2.cloud.redislabs.com',
        port: 10211
    }
});
redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect();

export const gameRoomRepo = new Repository(SCHEMAS.gameRoomSchema, redis);
await gameRoomRepo.createIndex();
export const playerRepo = new Repository(SCHEMAS.playerSchema, redis);
await playerRepo.createIndex();

export default redis;