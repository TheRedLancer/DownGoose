import express from 'express'
import { fileURLToPath } from 'url';
import cors from 'cors';
import path from 'path';
import { config } from './src/config.js';
import { EntityId } from 'redis-om';
import redis, { createGameRoom, addPlayerToRoom, addPlayerToRoomCode } from './src/db.js'

const port = process.env.SERVER_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function startServer() {
    const server = express();
    // console.log(config.ALLOWED_HOSTS);
    console.log(`running on ${port}`);
    var corsOptions = {
        origin: config.ALLOWED_HOSTS,
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    
    server.use(cors(corsOptions));
    server.use(express.static(path.join(__dirname, 'public')));

    server.put('/api/room/create', express.json(), async (req, res) => {
        console.log(req.body);
        let {roomCode} = req.body;
        let room, status, message;
        try {
            room = await createGameRoom(roomCode);
            status = 200;
            message = "OK";
        } catch (error) {
            console.log(error);
            console.log("Unable to create room!");
            message = "Unable to create room!";
            status = 400;
        }
        res.status(status).send({
            createdRoom: room,
            roomId: room[EntityId],
            message: message,
        });
    });

    server.set('/api/room/add_player', express.json(), async (req, res) => {
        console.log(req.body);
        let {roomCode, username} = req.body;
        let room, status, message;
        try {
            [room, player] = await addPlayerToRoomCode(roomCode, username);
            status = 200;
            message = "OK"
        } catch (error) {
            console.log(error, "Unable to add player");
            message = "Unable to add player";
            status = 400;
        }
        res.status(status).send({
            createdRoom: room,
            roomId: room[EntityId],
            message: message,
        });
    });

    server.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    server.listen(port);
}