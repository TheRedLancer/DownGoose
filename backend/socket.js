import { Server } from "socket.io";
import { customAlphabet } from 'nanoid/non-secure';
import { config } from "./src/config.js";
import RoomManager from "./src/roomManager.js";
import { instrument } from '@socket.io/admin-ui';
import db, { getJSON, setJSON } from "./src/db.js";

const port = process.env.SOCKET_PORT || 8000;

export default function startSocket() {

const io = new Server(port, {
    cors: {
        origin: config.ALLOWED_HOSTS,
        credentials: true
    }
});

const gameIO = io.of("/game");
gameIO.on('connection', async socket => {
    console.log(socket.id, "connected");

    socket.on("ping", () => {
        console.log(socket.id, "got ping");
        socket.volatile.emit("pong", socket.id);
        console.log(socket.id, "emit pong")
    });

    socket.on('create-room', async (nickname, roomCode, cb) => {
        if (!nickname) {
            cb({
                name: nickname,
                roomCode: roomCode,
                code: 1, // Conflict with current state (failure to create room)
                message: "Nickname empty"
            });
            return;
        }
        if (!roomCode) {
            cb({
                name: nickname,
                roomCode: roomCode,
                code: 1, // Room code cannot be empty
                message: "Room code empty"
            });
            return;
        }
        console.log("create-room", nickname, roomCode);
        if (RoomManager.roomExists(roomCode)) {
            console.log("Room creation: FAIL");
            cb({
                name: nickname,
                roomCode: roomCode,
                code: 1, // Conflict with current state (failure to create room)
                message: "Room code already exists"
            });
            return;
        }
        let res = await RoomManager.createRoom(roomCode);
        if (res) {
            console.log("Room creation: OK");
            cb({
                name: nickname,
                roomCode: roomCode,
                code: 0, // Created new room
                message: "Created room"
            });
            return;
        }
        cb({
            name: nickname,
            roomCode: roomCode,
            code: 3, // Conflict with current state (failure to create room)
            message: "Bad room creation"
        })
        return;
    })

    socket.on("disconnect", () => {
        console.log(socket.id, "disconnected");
    });
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

}