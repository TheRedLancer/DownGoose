import { Entity } from "redis-om";

type Player = {
    nickname: string,
    joinTime: number,
    cardColors: number[],
    currentRotation: number,
    ready: boolean,
    colorChoice: number,
    doneRotating: boolean,
    id: string,
    [key: string]: any
}

type LobbyPlayer = {
    nickname: string,
    id: string,
    isReady: boolean,
}

type LobbyPlayers = Array<LobbyPlayer>;

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