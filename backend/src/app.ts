import startExpress from './server.js';
import startSocket from './socket.js';
import {Server} from 'socket.io';
import {createServer} from 'http';
import {config} from './config.js';

const port = process.env.PORT || 3000;

const app = startExpress();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: config.ALLOWED_HOSTS,
        credentials: true,
    },
});
startSocket(io);

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
