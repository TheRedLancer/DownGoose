import { Entity } from "redis-om";

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
    colorChoice: number,
    doneRotating: boolean,
    id: string,
    [key: string]: any
}

type GameState = {
    roomId: string,
    roomCode: string,
    players: GamePlayer[]
    activePlayer: string
}