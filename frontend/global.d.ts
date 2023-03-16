/* roomJoin response data 
{
    "room": {
        "version": 1,
        "createTime": "2023-03-15T06:47:03.000Z",
        "playerJoined": 1678862830,
        "startGame": "1969-12-31T23:59:59.000Z",
        "players": [
            "01GVJ0BDB0QJ1X3EXAZ85HRB4G",
            "01GVJ0BJ935E7FAPEB8KGRXFJ0"
        ],
        "lastInteraction": 1678862830,
        "roomCode": "t1",
        "activePlayer": "",
        "nextPlayer": "",
        "gameState": 1
    },
    "roomId": "01GVJ0BC8YX7KDMJDH1DZ2M76H",
    "player": {
        "version": 1,
        "nickname": "r",
        "roomCode": "t1",
        "joinTime": 1678862829,
        "cardColors": [],
        "currentRotation": -1,
        "ready": false,
        "action": -1,
        "colorChoice": -1,
        "doneRotating": false
    },
    "playerId": "01GVJ0BJ935E7FAPEB8KGRXFJ0",
    "message": "OK"
}
*/

interface Player {
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

interface LobbyPlayer {
    nickname: string,
    id: string,
    isReady: boolean,
}

type LobbyPlayers = Array<LobbyPlayer>;