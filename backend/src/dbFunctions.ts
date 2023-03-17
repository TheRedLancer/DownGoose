import { gameRoomRepo, playerRepo } from "./db";
import { EntityId, EntityData, EntityDataValue, Entity, FieldType} from "redis-om";
import { config } from './config';

function redis_now() {
    return Math.floor((new Date()).getTime() / 1000);
}

export async function createGameRoom(roomCode : string) {
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
    if (!room_r[EntityId]) {
        return null;
    }
    await gameRoomRepo.expire(room_r[EntityId], config.HOUR_EXPIRATION);
    return room_r;
}

export async function addPlayerToRoomCode(roomCode: string, nickname: string) {
    let room = await gameRoomRepo.search().where('roomCode').equals(roomCode).return.first()//.return.first()//.catch((e) => {console.log(e, "banana"); return null});
    console.log("addPlayerToRoom");
    //console.log("addPlayerToRoom:", room);
    if (!room) {
        throw new Error(`Room ${roomCode} does not exist`);
    }
    return addPlayerToRoom(room, nickname);
}

export async function addPlayerToRoom(room: Entity, nickname: string): Promise<[(Entity | null), (Entity | null)]> {
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
    let player_r: Entity = await playerRepo.save(player);
    //console.log("Player_r:", player_r, "room", room);
    if (!player_r[EntityId]) {
        return [room, null];
    }
    await playerRepo.expire(player_r[EntityId], config.HOUR_EXPIRATION);
    room.lastInteraction = redis_now();
    room.playerJoined = redis_now();
    // @ts-ignore
    room.players.push(player_r[EntityId]);
    room = await gameRoomRepo.save(room);
    //console.log("after room", room);
    return [room, player_r];
}

export async function getLobbyData(roomId: string) {
    let room = await gameRoomRepo.fetch(roomId);
    if (!room) {
        throw new Error("Room does not exist");
    }
    let rPlayer : any = room.players;
    let players = await rPlayer.map(async (id: string) => {
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

export async function readyPlayer(playerId: string, isReady: boolean) {
    let player = await playerRepo.fetch(playerId);
    if (!player) {
        throw new Error("Player does not exist");
    }
    player.ready = isReady;
    await playerRepo.save(player);
}
