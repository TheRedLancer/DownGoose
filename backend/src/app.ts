import startExpress from "./server.js"
import startSocket from "./socket.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { config } from "./config.js";

const app = startExpress();
const server = createServer(app);
const io = new Server(server,  {
    cors: {
        origin: config.ALLOWED_HOSTS,
        credentials: true
    }
});
startSocket(io);

server.listen(3000, () => {
    console.log("listening on *:3000")
})