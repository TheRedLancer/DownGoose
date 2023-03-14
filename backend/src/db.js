import { createClient } from 'redis'
import {Repository, EntityId} from 'redis-om';
import * as SCHEMAS from './schemas.js'
import { config } from './config.js';

const redis = createClient({
    url: 'redis://127.0.0.1:6379'
});
redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect();

const gameRoomRepo = new Repository(SCHEMAS.gameRoomSchema, redis);
await gameRoomRepo.createIndex();
const playerRepo = new Repository(SCHEMAS.playerSchema, redis);
await playerRepo.createIndex();

function redis_now() {
    return Math.floor((new Date()).getTime() / 1000);
}

export async function createGameRoom(roomCode) {
    let room = {
        version: 1,
        createTime: redis_now(),
        playerJoined: -1,
        startGame: -1,
        players: [],
        lastInteraction: redis_now(),
        roomCode: roomCode,
        activePlayer: "",
        nextPlayer: "",
        gameState: 'lobby',
    }
    let room_r = await gameRoomRepo.save(room);
    //await gameRoomRepo.expire(room_r[EntityId], 60*5);
    return room_r;
}

export async function addPlayerToRoomCode(roomCode, nickname) {
    let room = await gameRoomRepo.search().where('roomCode').equals(roomCode).return.first()//.return.first()//.catch((e) => {console.log(e, "banana"); return null});
    console.log("addPlayerToRoom:", room);
    if (!room) {
        throw new Error(`Room ${roomCode} does not exist`);
    }
    return addPlayerToRoom(room, nickname);
}

export async function addPlayerToRoom(room, nickname) {
    let player = {
        version: 1,
        nickname: nickname,
        roomCode: room.roomCode,
        joinTime: redis_now(),
        cardColors: [],
        currentRotation: -1,
        ready: false,
        action: -1,
        colorChoice: -1,
        doneRotating: false,
    }
    let player_r = await playerRepo.save(player);
    console.log("Player_r:", player_r, "room", room);
    //await playerRepo.expire(player_r[EntityId], 60*5);
    room.lastInteraction = redis_now();
    room.playerJoined = redis_now();
    room.players.push(player_r[EntityId]);
    room = await gameRoomRepo.save(room);
    console.log("after room", room);
    return [room, player_r];
}

export default redis;