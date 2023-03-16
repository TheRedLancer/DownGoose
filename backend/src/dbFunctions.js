import { gameRoomRepo, playerRepo } from "./db.js";
import { EntityId } from "redis-om";
import { config } from './config.js';

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
        gameState: 1,
    }
    let room_r = await gameRoomRepo.save(room);
    await gameRoomRepo.expire(room_r[EntityId], config.HOUR_EXPIRATION);
    return room_r;
}

export async function addPlayerToRoomCode(roomCode, nickname) {
    let room = await gameRoomRepo.search().where('roomCode').equals(roomCode).return.first()//.return.first()//.catch((e) => {console.log(e, "banana"); return null});
    console.log("addPlayerToRoom");
    //console.log("addPlayerToRoom:", room);
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
    //console.log("Player_r:", player_r, "room", room);
    await playerRepo.expire(player_r[EntityId], config.HOUR_EXPIRATION);
    room.lastInteraction = redis_now();
    room.playerJoined = redis_now();
    room.players.push(player_r[EntityId]);
    room = await gameRoomRepo.save(room);
    //console.log("after room", room);
    return [room, player_r];
}

export async function getLobbyData(roomId) {
    let room = await gameRoomRepo.fetch(roomId);
    if (!room) {
        throw new Error("Room does not exist!");
    }
    let players = await room.players.map(async id => {
        let player = await playerRepo.fetch(id);
        let player_data = {
            nickname: player.nickname,
            id: id,
            isReady: player.ready
        }
        return player_data;
    });
    return Promise.all(players);
}

export async function readyPlayer(playerId, isReady) {
    let player = await playerRepo.fetch(playerId);
    if (!player) {
        throw new Error("Player does not exist");
    }
    player.ready = isReady;
    await playerRepo.save(player);
}
