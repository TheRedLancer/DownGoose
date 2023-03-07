import { Server } from "socket.io";
import { customAlphabet } from 'nanoid/non-secure';
import { config } from "./src/config.js"
import Room from "./src/roomManager.js";

const port = process.env.PORT || 8000;

const nanoid = customAlphabet('1234567890abcdef', 5);

import { instrument } from '@socket.io/admin-ui';
const io = new Server(port, {
    cors: {
        origin: config.ALLOWLIST_HOSTS,
        credentials: true
    }
});

const roomIO = io.of('/room');
roomIO.on('connection', async socket => {
    const { username, roomId, action } = socket.handshake.query;
    console.log(socket.id);
    const room = new Room(roomIO, socket, roomId, action);
    const joinedRoom = await room.init(username);

    if (joinedRoom) {
        console.log(username, "joined room", roomId);
        room.showLobby();
        room.nextTurn();
        room.gameOver();
    }

    room.onDisconnect();
});

io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});

instrument(io, {
    auth: false,
    mode: "development"
});

