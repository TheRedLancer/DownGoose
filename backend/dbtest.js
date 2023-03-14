import { createClient } from 'redis'
import {Schema, Repository, EntityId} from 'redis-om';

let gameRoomRepo, playerRepo;

const gameRoomSchema = new Schema('gameRoom', {
    roomCode: {type: 'string'},
    players: {type: 'string[]'},
}, {
    dataStructure: 'JSON'
});

const playerSchema = new Schema('player', {
    name: {type: 'string'},
    roomCode: {type: 'string'},
}, {
    dataStructure: 'JSON'
});

async function addRoom(roomCode) {
    let room = {
        players: [],
        roomCode: roomCode
    }
    gameRoomRepo.save(room);
}

async function addPlayer(roomCode, nickname) {
    let room = await gameRoomRepo.search().where('roomCode').equals(roomCode).return.first();
    let player = {
        nickname: nickname,
        roomCode: room.roomCode,
    };
    let player_r = await playerRepo.save(player);
    room.players.push(player_r[EntityId]);
    gameRoomRepo.save(room);
}

export default async function main() {
    const redis = createClient({
        url: 'redis://127.0.0.1:6379'
    });
    redis.on('error', (err) => console.log('Redis Client Error', err));
    await redis.connect();
    
    gameRoomRepo = new Repository(gameRoomSchema, redis);
    await gameRoomRepo.createIndex();
    playerRepo = new Repository(playerSchema, redis);
    await playerRepo.createIndex();

    //addRoom("R1");
    //addPlayer("R1", "P1");
    addPlayer("R1", "P2");
}