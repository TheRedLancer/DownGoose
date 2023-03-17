import { createGameRoom, addPlayerToRoom, addPlayerToRoomCode } from './dbFunctions.js'
import { EntityId, Entity } from 'redis-om';
import { Request } from 'express';
import { PlayerResponse, RoomResponse } from '../global.js';

async function createRoomFromRequest(req: Request) : Promise<[number, RoomResponse]> {
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
    if (!room) {
        return [500, {
            room: null,
            roomId: null,
            message: "Unable to create Room"
        }];
    }
    let data = {
        room: room,
        roomId: room[EntityId],
        message: message,
    }
    return [status, data]
}

async function addPlayerToRoomFromRequest(req: Request) {
    let {roomCode, nickname} = req.body;
    let status = 0
    let data: PlayerResponse = {
        room: undefined,
        roomId: undefined,
        player: undefined,
        playerId: undefined,
        message: "",
    };
    let res = await addPlayerToRoomCode(roomCode, nickname);
    if (!res) {
        return [500, {
            room: null,
            roomId: null,
            player: null,
            playerId: null,
            message: "server error"
        }];
    }
    if (!res[0] || !res[1]) {
        return [500, {
            room: null,
            roomId: null,
            player: null,
            playerId: null,
            message: "server error"
        }];
    }
    let room = res[0];
    let player = res[1];
    status = 200;
    data = {
        room: room,
        roomId: room[EntityId],
        player: player,
        playerId: player[EntityId],
        message: "OK",
    }
    return [status, data];
}

export {createRoomFromRequest, addPlayerToRoomFromRequest}