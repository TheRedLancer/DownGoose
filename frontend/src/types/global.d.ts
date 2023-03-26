import { Entity } from "redis-om";
export {};

declare global {
    type LobbyPlayer = {
        nickname: string,
        id: string,
        isReady: boolean,
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
    }
}
