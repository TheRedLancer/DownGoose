import { Server } from "socket.io";
import { config } from "./config.js";
import LobbyManager from "./lobbyManager.js";
import { instrument } from '@socket.io/admin-ui';
import db from "./db.js";
import GameManager from './gameManager.js';

const port = config.SOCKET_PORT || 8000;

export default function startSocket() {

const io = new Server(port, {
    cors: {
        origin: config.ALLOWED_HOSTS,
        credentials: true
    }
});

LobbyManager.listen(io.of("/lobby"));
GameManager.listen(io.of("/game"));

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