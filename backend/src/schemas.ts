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

export { gameRoomSchema, playerSchema } 