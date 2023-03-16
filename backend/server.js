import express from 'express'
import { fileURLToPath } from 'url';
import cors from 'cors';
import path from 'path';
import { config } from './src/config.js';
import { createRoomFromRequest, addPlayerToRoomFromRequest } from './src/serverFunctions.js';

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
        // TODO: Add error handling for if room already exists
        //console.log("create body", req.body);
        console.log("create");
        let [status, data] = await createRoomFromRequest(req);
        res.status(status).send(data);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    });

    server.put('/api/room/add_player', express.json(), async (req, res) => {
        // console.log("add_player body", req.body);
        console.log("add_player");
        try {
            let [status, data] = await addPlayerToRoomFromRequest(req);
            //console.log("status:", status, "data:", data);
            res.status(status).send(data);
        } catch (error) {
            console.log(error);
            res.status(400).send({});
        }
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    });

    server.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    server.listen(port);
}