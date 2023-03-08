import { Server, Socket } from 'socket.io';
import { config } from './config.js'
const { DEFAULT_MAX_PLAYERS } = config;
import * as DB from './db.js'
import schemas from './schemas.js';

const RoomManager = {
    roomExists: async function (roomCode) {
        if (await DB.getJSON("room:" + roomCode, "", 0)) {
            return true;
        }
        return false;
    },

    createRoom: async function (roomCode) {
        await DB.setJSON("room:" + roomCode, JSON.stringify(schemas.Room(roomCode)));
    },

    joinRoom: async function (roomCode, username) {
        await DB.arrappendJSON("room:" + roomCode, JSON.stringify(schemas.Player(username)), ".players");
    }
};

export default RoomManager;