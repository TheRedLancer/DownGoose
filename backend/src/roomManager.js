import { Server, Socket } from 'socket.io';
import { config } from './config.js'
const { DEFAULT_MAX_PLAYERS } = config;
import db, { getJSON, setJSON } from './db.js'
import Room from './schema/roomSchema.js';

const RoomManager = {
    roomExists: async function (roomCode) {
        if (getJSON("room:" + roomCode, "$", 0)) {
            return true;
        }
        return false;
    },

    createRoom: async function (roomCode) {
        let res = await setJSON("room:" + roomCode, JSON.stringify(Room(roomCode)));
        return res === "OK";
    },

    joinRoom: async function (roomCode, username) {
        return false;
    }
};

export default RoomManager;