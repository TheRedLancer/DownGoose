import { Schema } from 'redis-om'

const gameRoomSchema = new Schema('gameRoom', {
    version: {type: 'number'},
    createTime: {type: 'date'},
    playerJoined: {type: 'date'},
    startGame: {type: 'date'},
    lastInteraction: {type: 'date'},
    players: {type: 'string[]'},
    roomCode: {type: 'string'},
    activePlayer: {type: 'string'},
    nextPlayer: {type: 'string'},
    gameState: {type: 'string'},
}, {
    dataStructure: 'JSON'
})

const playerSchema = new Schema('player', {
    version: {type: 'number'},    
    nickname: {type: 'string'},
    roomCode: {type: 'string'},
    joinTime: {type: 'date'},
    cardColors: {type: 'string[]'}, // ['1', '0', '3', '2']
    currentRotation: {type: 'number'},
    ready: {type: 'boolean'},
    action: {type: 'number'}, // 0: waiting, 1: downgoose, 2: color
    colorChoice: {type: 'number'},
    doneRotating: {type: 'boolean'},
}, {
    dataStructure: 'JSON'
})

// const schemas = {
//     Room: function (roomCode) {
//         return {
//             version: "1",
//             createTime: Date.now(),
//             playerJoined: -1,
//             startGame: -1,
//             lastInteraction: Date.now(),
//             code: roomCode,
//             players: [],
//             activePlayer: "",
//             nextPlayer: "",
//             gameState: "lobby",
//         }
//     },
//     Player: function (nickname) {
//         return {
//             version: "1",
//             nickname: nickname,
//             id: "",
//             joinTime: Date.now(),
//             cardColors: [], // ['1', '0', '3', '2']
//             currentRotation: 0,
//             ready: false,
//             action: 0, // 1: DownGoose!, 2: Color
//             colorChoice: 0,
//             doneRotating: false,
//         }
//     },
// }

export { gameRoomSchema, playerSchema } 