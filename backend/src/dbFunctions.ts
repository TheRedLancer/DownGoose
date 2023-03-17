import { EntityId, EntityData, EntityDataValue, Entity, FieldType} from "redis-om";
import { gameRoomRepo, playerRepo } from "./db.js";
import { config } from './config.js';
import { GameState } from "../global.js";

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
    let room_r = await gameRoomRepo.save(room);
    //console.log("after room", room);
    return [room_r, player_r];
}

export async function getLobbyData(roomId: string) {
    let room = await gameRoomRepo.fetch(roomId);
    if (!room) {
        throw new Error("Room does not exist");
    }
    // @ts-ignore
    let players = await room.players.map(async (id: string) => {
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

export async function startGame(roomId: string) {
    let room = await gameRoomRepo.fetch(roomId);
    if (!room) {
        throw new Error("Room does not exist");
    }
    // Player
    // cardColors: {type: 'string[]'}, // ['1', '0', '3', '2']
    // currentRotation: {type: 'number'},

    // Room
    // startGame: {type: 'date'},
    // lastInteraction: {type: 'date'},
    // activePlayer: {type: 'string'},
    // gameState: {type: 'number'},

    // @ts-ignore room.players is going to be a string[] if it exists
    let players = room.players.map(async (playerId: string) => {
        let player = await playerRepo.fetch(playerId);
        // Give each player a card
        player.cardColors = generateCard();
        // Set each players card's rotation
        player.currentRotation = Math.floor(Math.random() * 4);
        return await playerRepo.save(player);
    });
    // Set start game time
    room.startGame = redis_now();
    room.lastInteraction = redis_now();
    room.gameState = 2;
    // Choose random start player
    // @ts-ignore room.players is going to be a string[] if it exists
    room.activePlayer = Math.floor(Math.random() * room.players.length);
    return gameState(room, players);
}

function generateCard(): string[] {
    let card = ['0', '1', '2', '3'];
    for (let i = card.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (card.length));
        [card[i], card[j]] = [card[j], card[i]];
    }
    return card;
}

function gameState(room: Entity, players: Entity): GameState{
        return {
        roomId: "string",
        roomCode: "string",
        players: [{
            nickname: "string",
            cardColors: ["0", "1", "2", "3"],
            currentRotation: 0,
            colorChoice: 0,
            doneRotating: false,
            id: "string",
        }],
        activePlayer: "string"
    }
}