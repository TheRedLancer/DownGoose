import { Server } from "socket.io";
import { customAlphabet } from 'nanoid/non-secure';
import { config } from "./src/config.js";
import RoomManager from "./src/roomManager.js";
import { instrument } from '@socket.io/admin-ui';
import db from "./src/db.js";

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

    socket.on('create-room', async (roomCode, cb) => {
        console.log("create-room", roomCode);
        if (await RoomManager.roomExists(roomCode)) {
            console.log("Room creation: FAIL");
            cb({
                roomCode: null,
                code: 1, // Conflict with current state (failure to create room)
                message: "Room code already exists"
            });
            return;
        }
        console.log("Room does not exist");
        try {
            await RoomManager.createRoom(roomCode);
            console.log("Room creation: OK");
            cb({
                roomCode: roomCode,
                code: 0, // Created new room
                message: "Created room"
            });
        } catch (e) {
            console.log(e);
            cb({
                roomCode: null,
                code: 3, // Failed to create room
                message: "Bad room creation"
            });
        }        
    });

    socket.on("join-room", async (roomCode, username, cb) => {
        console.log(socket.id, "joining", roomCode, "as", username);
        if (!(await RoomManager.roomExists(roomCode))) {
            cb({
                username: username,
                roomCode: null,
                code: 1, // Conflict with current state (failure to create room)
                message: "Cannot join room: room does not exist"
            });
            return;
        }
        try {
            await RoomManager.joinRoom(roomCode, username);
            socket.join(roomCode);
            console.log(socket.rooms, roomCode, username);
            gameIO.in(roomCode).emit("player-join", username);
            console.log(username, "room join: OK");
            cb({
                username: username,
                roomCode: roomCode,
                code: 0, // Created new room
                message: "Joined room"
            });
        } catch (e) {
            console.log(e);
            cb({
                username: username,
                roomCode: null,
                code: 3, // Failed to join room
                message: "Cannot join room: bad room join"
            })
        }        
    });

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