import { EntityId, EntityData, EntityDataValue, Entity, FieldType} from "redis-om";
import { roomRepo, playerRepo } from "./db.js";
import { config } from './config.js';
import { nanoid } from 'nanoid'

function makePlayer(nickname: string, roomCode: string): Player {
    return {
        version: 1,
        nickname: nickname,
        roomCode: roomCode,
        joinTime: now_seconds(),
        cardColors: [],
        currentRotation: -1,
        ready: false,
        action: -1,
        id: nanoid()
    }
}

function makeRoom(roomCode: string): Room {
    return {
        version: 1,
        createTime: now_seconds(),
        playerJoined: -1,
        startGame: -1,
        lastInteraction: now_seconds(),
        players: [],
        roomCode: roomCode,
        activePlayer: 0,
        gameOver: false,
        id: nanoid()
    }
}

function now_seconds() {
    return Math.floor((new Date()).getTime() / 1000);
}

/**
 * @param room database entity
 * @returns List of players
 */
async function getPlayersInRoom(room: Room): Promise<Player[]> {
    const players = room.players.map(async (playerId: string) => {
        const player_r = await playerRepo.fetch(playerId) as Player;
        return player_r;
    });
    return Promise.all(players);
}

export async function createGameRoom(roomCode : string) {
    const room = makeRoom(roomCode);
    const room_r = await roomRepo.save(room.id, room) as Room;
    if (!room_r) {
        return null;
    }
    await roomRepo.expire(room_r.id, config.HOUR_EXPIRATION);
    return room_r;
}

export async function addPlayerToRoomCode(roomCode: string, nickname: string) {
    const room = await roomRepo.search().where('roomCode').equals(roomCode).return.first() as Room | null
    if (!room) {
        throw new Error(`Room ${roomCode} does not exist`);
    }
    return addPlayerToRoom(room, nickname);
}

export async function addPlayerToRoom(room: Room, nickname: string): Promise<[Room, Player]> {
    const player = makePlayer(nickname, room.roomCode)
    const player_r = await playerRepo.save(player.id, player) as Player;
    await playerRepo.expire(player_r.id, config.HOUR_EXPIRATION);
    room.lastInteraction = now_seconds();
    room.playerJoined = now_seconds();
    room.players.push(player_r.id);
    const room_r = await roomRepo.save(room) as Room;
    return [room_r, player_r];
}

export async function getLobbyData(roomId: string): Promise<LobbyPlayer[]> {
    let room = await roomRepo.fetch(roomId) as Room | null;
    if (!room) {
        throw new Error("Room does not exist");
    }
    let players = (await getPlayersInRoom(room)).map(player => {
        let player_data : LobbyPlayer = {
            nickname: player.nickname,
            id: player.id,
            ready: player.ready
        }
        return player_data;
    })
    return players;
}

export async function readyPlayer(playerId: string, ready: boolean) {
    let player = await playerRepo.fetch(playerId) as Player | null;
    console.log(player);
    if (!player) {
        throw new Error("Player does not exist");
    }
    player.ready = ready;
    await playerRepo.save(player);
}

export async function startGame(roomId: string)  {
    let room = await roomRepo.fetch(roomId) as Room | null;
    if (!room) {
        throw new Error("Room does not exist");
    }
    const players = room.players.map(async (playerId: string) => {
        let player = await playerRepo.fetch(playerId) as Player | null;
        if (!player) {
            throw new Error("Player does not exist");
        }
        // Give each player a card
        player.cardColors = generateCard();
        // Set each players card's rotation
        player.currentRotation = Math.floor(Math.random() * 4);
        player.ready = false;
        return await playerRepo.save(player) as Player;
    });
    // Set start game time
    room.startGame = now_seconds();
    room.lastInteraction = now_seconds();

    // Choose random start player
    room.activePlayer = Math.floor(Math.random() * room.players.length);

    let room_r = await roomRepo.save(room) as Room;
    return Promise.all([room_r, Promise.all(players)]);
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
    let room = await roomRepo.fetch(roomId) as Room | null;
    if (!room) {
        throw new Error("Room does not exist");
    }
    let players = await getPlayersInRoom(room);
    return gameState(room, players);
}

/**
 * Parse database items into gamestate to send to the frontend
 * @param room
 * @param players
 * @returns
 */
export function gameState(room: Room, players: Player[]): GameState {
    let state: GameState = {
        roomId: room.id,
        roomCode: room.roomCode,
        players: [],
        activePlayer: room.players[room.activePlayer],
        gameOver: room.gameOver
    }
    
    state.players = players.map((player: Player): GamePlayer => {
        return {
            nickname: player.nickname,
            cardColors: player.cardColors,
            currentRotation: player.currentRotation,
            action: player.action,
            ready: player.ready,
            id: player.id
        }
    });

    return state;
}

export async function setColorAction(playerId: string, roomId: string, color: number): Promise<GameState> {
    const room = await roomRepo.fetch(roomId) as Room | null;
    if (!room) {
        throw new Error("Room does not exist");
    }
    const players = await getPlayersInRoom(room);
    const players_r = players.map(async (player) => {
        if (player.id === playerId) {
            player.action = color;
        }
        player.ready = false;
        return await playerRepo.save(player) as Player;
    });
    return gameState(room, await Promise.all(players_r));
}

export async function setQuackAction(playerId: string, roomId: string) {
    const room = await roomRepo.fetch(roomId) as Room | null;
    if (!room) {
        throw new Error("Room does not exist");
    }
    const players = await getPlayersInRoom(room);
    const players_r = players.map(async (player) => {
        if (player.id === playerId) {
            player.action = 4;
        }
        player.ready = false;
        return await playerRepo.save(player) as Player;
    });
    return gameState(room, await Promise.all(players_r));
}

export async function colorResponse(playerId: string, roomId: string, isRotating: boolean) {
    let room = await roomRepo.fetch(roomId) as Room | null;
    if (!room) {
        throw new Error("Room does not exist");
    }
    const activePlayer = await playerRepo.fetch(room.players[room.activePlayer]) as Player | null;
    if (!activePlayer) {
        throw new Error("Player does not exist");
    }
    const calledColor = (activePlayer.action as number).toString();
    let currentPlayer = await playerRepo.fetch(playerId) as Player | null;
    if (!currentPlayer) {
        throw new Error("Player does not exist");
    }
    if (isRotating) {
        currentPlayer.currentRotation = (currentPlayer.cardColors).indexOf(calledColor);
    }
    currentPlayer.ready = true;
    await playerRepo.save(currentPlayer);
    let players = await getPlayersInRoom(room);
    if (checkTurnOver(players)) {
        nextTurn(room, players);
        room = await roomRepo.save(room) as Room;
        players = await Promise.all(players.map(async (player) => {
            return await playerRepo.save(player) as Player;
        }));
    }
    return gameState(room, players);
}

export async function quackResponse(playerId: string, roomId: string) {
    const player = await playerRepo.fetch(playerId);
    player.ready = true;
    await playerRepo.save(player);
    let room = await roomRepo.fetch(roomId) as Room;
    let players = await getPlayersInRoom(room);
    if (checkGameOver(players)) {
        room.gameOver = true;
    } else if (checkTurnOver(players)) {
        nextTurn(room, players);
        room = await roomRepo.save(room) as Room;
        players = await Promise.all(players.map(async (player) => {
            return await playerRepo.save(player) as Player;
        }));
    }
    return gameState(room, players);
}

function checkTurnOver(players: Player[]): boolean {
    for (const player of players) {
        if (!player.ready) {
            return false;
        }
    }
    return true;
}

function checkGameOver(players: Player[]): boolean {
    for (const player of players) {
        if (!player.currentRotation) {
            return false;
        }
    }
    return true;
}

function nextTurn(room: Room, players: Player[]) {
    room.activePlayer += 1;
    if (room.activePlayer === room.players.length) {
        room.activePlayer = 0;
    }
    room.lastInteraction = now_seconds();
    for (const player of players) {
        player.ready = false;
        player.action = -1;
    }
}
