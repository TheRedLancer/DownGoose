import { EntityId, EntityData, EntityDataValue, Entity, FieldType} from "redis-om";
import { roomRepo, playerRepo } from "./db.js";
import { config } from './config.js';
import { GamePlayer, GameState } from "../global.js";
import { LobbyPlayer } from '../../frontend/src/global';

function now_seconds() {
    return Math.floor((new Date()).getTime() / 1000);
}

/**
 * @param room database entity
 * @returns List of players
 */
async function getPlayersInRoom(room: Entity): Promise<Entity[]> {
    if (!room.players) {
        return Promise.resolve([]);
    }
    let players: Promise<Entity>[];
    // @ts-ignore Could use room.players as string[], but no need to allocate new object
    players = room.players.map(async (playerId: string) => {
        return await playerRepo.fetch(playerId);
    });
    return Promise.all(players);
}

export async function createGameRoom(roomCode : string) {
    let room = {
        version: 1,
        createTime: now_seconds(),
        playerJoined: -1,
        startGame: -1,
        players: [],
        lastInteraction: now_seconds(),
        roomCode: roomCode,
        activePlayer: "",
    }
    let room_r = await roomRepo.save(room);
    if (!room_r[EntityId]) {
        return null;
    }
    await roomRepo.expire(room_r[EntityId], config.HOUR_EXPIRATION);
    return room_r;
}

export async function addPlayerToRoomCode(roomCode: string, nickname: string) {
    let room = await roomRepo.search().where('roomCode').equals(roomCode).return.first()//.return.first()//.catch((e) => {console.log(e, "banana"); return null});
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
        joinTime: now_seconds(),
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
    room.lastInteraction = now_seconds();
    room.playerJoined = now_seconds();
    // @ts-ignore
    room.players.push(player_r[EntityId]);
    let room_r = await roomRepo.save(room);
    //console.log("after room", room);
    return [room_r, player_r];
}

export async function getLobbyData(roomId: string): Promise<LobbyPlayer[]> {
    let room = await roomRepo.fetch(roomId);
    if (!room) {
        throw new Error("Room does not exist");
    }
    let players = (await getPlayersInRoom(room)).map(player => {
        let player_data : LobbyPlayer = {
            nickname: player.nickname as string,
            id: player[EntityId] as string,
            isReady: player.ready as boolean
        }
        return player_data;
    })
    return players;
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
    let room = await roomRepo.fetch(roomId);
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

    // @ts-ignore Could use room.players as string[], but no need to allocate new object
    let players = room.players.map(async (playerId: string) => {
        let player = await playerRepo.fetch(playerId);
        // Give each player a card
        player.cardColors = generateCard();
        // Set each players card's rotation
        player.currentRotation = Math.floor(Math.random() * 4);
        return await playerRepo.save(player);
    });
    //console.log("Game room players: ", await Promise.all(players));
    // Set start game time
    room.startGame = now_seconds();
    room.lastInteraction = now_seconds();
    room.gameState = 2;

    // Choose random start player
    // @ts-ignore Could use room.players as string[], but no need to allocate new object
    room.activePlayer = room.players[Math.floor(Math.random() * room.players.length)];

    let room_r = await roomRepo.save(room);
    //console.log("Game room", await room_r);
    return [room_r, Promise.all(players)];
}

function generateCard(): string[] {
    let card = ['0', '1', '2', '3'];
    for (let i = card.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (card.length));
        [card[i], card[j]] = [card[j], card[i]];
    }
    return card;
}

export async function getGameData(roomId: string): Promise<GameState> {
    let room = await roomRepo.fetch(roomId);
    let players = await getPlayersInRoom(room);
    return gameState(room, players);
}

/**
 * Parse database items into gamestate to send to the frontend
 * @param room
 * @param players
 * @returns
 */
export function gameState(room: Entity, players: Entity[]): GameState {
    let state: GameState = {
        roomId: room[EntityId] as string,
        roomCode: room.roomCode as string,
        players: [],
        activePlayer: room.activePlayer as string
    }
    state.players = players.map((player: Entity): GamePlayer => {
        return {
            nickname: player.nickname as string,
            cardColors: player.cardColors as string[],
            currentRotation: player.currentRotation as number,
            colorChoice: player.colorChoice as number,
            doneRotating: player.doneRotating as boolean,
            id: player[EntityId] as string
        }
    });

    return state;
}