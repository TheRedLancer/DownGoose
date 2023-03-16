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