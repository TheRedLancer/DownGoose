import { createGameRoom, addPlayerToRoom, addPlayerToRoomCode } from './dbFunctions.js'
import { EntityId } from 'redis-om';

async function createRoomFromRequest(req) {
    let {roomCode} = req.body;
    let room, status, message;
    try {
        room = await createGameRoom(roomCode);
        message = "OK";
        status = 200;
    } catch (error) {
        console.log(error);
        message = "Unable to create room!";
        status = 400;
    }
    //console.log(message);
    let data = {
        room: room,
        roomId: room[EntityId],
        message: message,
    }
    return [status, data]
}

async function addPlayerToRoomFromRequest(req) {
    let {roomCode, nickname} = req.body;
    let status, message, data;
    return await addPlayerToRoomCode(roomCode, nickname).then(([room, player]) => {
        status = 200;
        message = "OK";
        data = {
            roomId: room[EntityId],
            roomCode: room.roomCode,
            playerName: player.nickname,
            playerId: player[EntityId],
            message: message,
        }
        return [status, data];
    }).catch(error => {
        message = "Unable to add player";
        console.log(error, message);
        status = 404;
        data = {
            message: message,
        }
        return [status, data];
    }); 
}

export {createRoomFromRequest, addPlayerToRoomFromRequest}