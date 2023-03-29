import { Schema } from 'redis-om'

const gameRoomSchema = new Schema('gameRoom', {
    version: {type: 'number'},
    createTime: {type: 'date'},
    playerJoined: {type: 'date'},
    startGame: {type: 'date'},
    lastInteraction: {type: 'date'},
    roomCode: {type: 'string'},
    players: {type: 'string[]'},
    activePlayer: {type: 'number'},
    gameOver: {type: 'boolean'},
    numberQuacked: {type: 'number'},
    id: {type: 'string'}
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
    action: {type: 'number'}, // -1: lobby, 0-3: Call a Color, 4: Quack
    id: {type: 'string'}
}, {
    dataStructure: 'JSON'
})

export { gameRoomSchema, playerSchema } 