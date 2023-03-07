import { Server } from "socket.io";
import { customAlphabet } from 'nanoid/non-secure';
import { config } from "./src/config.js"
import RoomManager from "./src/roomManager.js";
import { instrument } from '@socket.io/admin-ui';

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
    const { username, roomId, action } = socket.handshake.query;
    const j = await gameIO.fetchSockets()
    for (const i of j) {
        console.log("IDS:")
        if (i.id != socket.id) {
            i.disconnect(close=true);
        }
        console.log(i.id, "connected");
    }
    // socket.volatile.emit("pong");
    socket.on("ping", () => {
        console.log(socket.id, "pinged us");
        // socket.volatile.emit("pong");
    });

    socket.on("disconnect", async socket => {
        console.log(socket.id, "disconnected");
    })
    //const room = new RoomManager(gameIO, socket, roomId, action);
    //const joinedRoom = await room.init(username);

    // if (joinedRoom) {
    //     console.log(username, "joined room", roomId);
    //     // attach listeners
    //     room.showLobby();
    //     room.nextTurn();
    //     room.gameOver();
    // }

    // room.onDisconnect();
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