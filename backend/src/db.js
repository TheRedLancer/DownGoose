import { createClient } from 'redis'
import {Repository, EntityId} from 'redis-om';
import * as SCHEMAS from './schemas.js'
import { config } from './config.js';

const redis = createClient({
    url: 'redis://127.0.0.1:6379'
});
redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect()
console.log(await redis.ping());

const gameRoomRepo = new Repository(SCHEMAS.gameRoomSchema, redis);
await gameRoomRepo.createIndex();
const playerRepo = new Repository(SCHEMAS.playerSchema, redis);
await gameRoomRepo.createIndex();

function redis_now() {
    return Date.now() * 1000;
}

export async function createGameRoom(roomCode) {
    let room = {
        version: 1,
        createTime: redis_now(),
        playerJoined: undefined,
        startGame: undefined,
        lastInteraction: redis_now(),
        roomCode: roomCode,
        players: [],
        activePlayer: undefined,
        nextPlayer: undefined,
        gameState: 'lobby',
    }
    let room_r = await gameRoomRepo.save(roomCode, room);
    await gameRoomRepo.expire(room_r[EntityId], 60*5);
    return room_r;
}

export async function addPlayerToRoomCode(roomCode, username) {
    let room = await gameRoomRepo.search().where('roomCode').equals(roomCode).return.all();
    if (!room) {
        throw new Error(`Room ${roomCode} does not exist`);
    }
    let player = undefined;
    [room, player] = addPlayerToRoom(room, username)
    return [room, player];
}

export async function addPlayerToRoom(room, username) {
    let player = {
        version: 1,
        username: username,
        roomCode: room.roomCode,
        joinTime: redis_now(),
        cardColors: [],
        currentRotation: undefined,
        ready: false,
        action: "waiting",
        colorChoice: undefined,
        doneRotating: undefined,
    }
    let player_r = await playerRepo.save(player);

    room.players = [...room.players, player_r[EntityID]];
    room.lastInteraction = redis_now();
    room.playerJoined = redis_now();
    room = await gameRoomRepo.save(room);
    console.log([room, player_r])

    return [room, player_r];
}

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