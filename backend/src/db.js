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
    return Math.floor((new Date()).getTime() / 1000);
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
    let room_r = await gameRoomRepo.save(room);
    await gameRoomRepo.expire(room_r[EntityId], 60*5);
    return room_r;
}

export async function addPlayerToRoomCode(roomCode, nickname) {
    let room = await gameRoomRepo.search().where('roomCode').equals(roomCode).return.all();
    if (!room) {
        throw new Error(`Room ${roomCode} does not exist`);
    }
    let player;
    [room, player] = addPlayerToRoom(room, nickname);
    return [room, player];
}

export async function addPlayerToRoom(room, nickname) {
    let player = {
        version: 1,
        nickname: nickname,
        roomCode: room.roomCode,
        joinTime: redis_now(),
        cardColors: [],
        currentRotation: undefined,
        ready: false,
        action: 0,
        colorChoice: undefined,
        doneRotating: undefined,
    }
    let player_r = await playerRepo.save(player);
    console.log("Player_r:", player_r);
    await playerRepo.expire(player_r[EntityId], 60*5);
    console.log(room.players);
    room.players = [...room.players, player_r[EntityId]];
    room.lastInteraction = redis_now();
    room.playerJoined = redis_now();
    room = await gameRoomRepo.save(room);
    return [room, player_r];
}

export default redis;