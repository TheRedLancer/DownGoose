import { createGameRoom, addPlayerToRoom, addPlayerToRoomCode } from './db.js'
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
    console.log(message);
    let data = {
        room: room,
        roomId: room[EntityId],
        message: message,
    }
    return [status, data]
}

async function addPlayerToRoomFromRequest(req) {
    let {roomCode, nickname} = req.body;
    let room, status, message, player, data;
    try {
        [room, player] = await addPlayerToRoomCode(roomCode, nickname);
        status = 200;
        message = "OK";
        data = {
            room: room,
            roomId: room[EntityId],
            player: player,
            playerId: player[EntityId],
            message: message,
        }
    } catch (error) {
        message = "Unable to add player";
        console.log(error, message);
        status = 400;
        data = {
            message: message,
        }
    }
    return [status, data]
}

export {createRoomFromRequest, addPlayerToRoomFromRequest}