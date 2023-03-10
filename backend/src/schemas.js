import { Schema, Repository} from 'redis-om'

const schemas = {
    Room: function (roomCode) {
        return {
            version: "1",
            createTime: Date.now(),
            playerJoined: -1,
            startGame: -1,
            lastInteraction: Date.now(),
            code: roomCode,
            players: [],
            activePlayer: "",
            nextPlayer: "",
            gameState: "lobby",
        }
    },
    Player: function (username) {
        return {
            version: "1",
            username: username,
            id: "",
            joinTime: Date.now(),
            cardColors: [], // ['1', '0', '3', '2']
            currentRotation: 0,
            ready: false,
            action: 0, // 1: DownGoose!, 2: Color
            colorChoice: 0,
            doneRotating: false,
        }
    },
}

export default schemas;