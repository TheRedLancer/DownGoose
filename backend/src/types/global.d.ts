import { Entity } from "redis-om";
export {};

declare global {
    type Player = {
        version: number,
        nickname: string,
        roomCode: string,
        joinTime: number,
        cardColors: string[], // ['1', '0', '3', '2']
        currentRotation: number,
        ready: boolean,
        action: number, // -1: lobby, 0-3: Call a Color, 4: Quack
        id: string,
        [Symbol(entityId)]: string,
        [Symbol(entityKeyName)]: string,
    }

    type Room = {
        version: number,
        createTime: number,
        playerJoined: number,
        startGame: number,
        lastInteraction: number,
        roomCode: string,
        players: string[],
        activePlayer: number,
        gameOver: boolean,
        numberQuacked: number,
        id: string
    }

    type LobbyPlayer = {
        nickname: string,
        id: string,
        ready: boolean,
    }

    type LobbyPlayers = LobbyPlayer[];

    type PlayerResponse = {
        room: Entity | null | undefined,
        roomId: string | null | undefined,
        player: Entity | null | undefined,
        playerId: string | null | undefined,
        message: string,
    }

    type RoomResponse = {
        room: Entity | null | undefined,
        roomId: string | null | undefined,
        message: string,
    }

    type GamePlayer = {
        nickname: string,
        cardColors: string[],
        currentRotation: number,
        ready: boolean,
        action: number,
        id: string
    }

    type GameState = {
        roomId: string,
        roomCode: string,
        players: GamePlayer[]
        activePlayer: string
        numberQuacked: number
        gameOver: boolean
    }
}
