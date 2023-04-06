import startExpress from './server.js';
import startSocket from './socket.js';
import {Server} from 'socket.io';
import {createAdapter} from '@socket.io/redis-adapter';
import {createServer} from 'http';
import {config} from './config.js';
import {getDB, createIndices} from './db.js';

const port = process.env.PORT || 3000;

const redisClient = await getDB();
createIndices();
const subClient = redisClient.duplicate();

const app = startExpress();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: config.ALLOWED_HOSTS,
        credentials: true,
    },
});
io.adapter(createAdapter(redisClient, subClient));
startSocket(io);

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
