import { config } from "./config.js";
import LobbyManager from "./lobbyManager.js";
import { instrument } from '@socket.io/admin-ui';
import GameManager from './gameManager.js';
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events.js";

const port = config.SOCKET_PORT || 8000;

export default function startSocket(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {

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