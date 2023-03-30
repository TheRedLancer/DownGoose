import express, {Request, Response} from 'express';
import {fileURLToPath} from 'url';
import cors from 'cors';
import path from 'path';
import {config} from './config.js';
import {
    createRoomFromRequest,
    addPlayerToRoomFromRequest,
} from './serverFunctions.js';

const port = process.env.SERVER_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function startExpress() {
    const app = express();
    // console.log(config.ALLOWED_HOSTS);
    console.log(`running on ${port}`);
    var corsOptions = {
        origin: config.ALLOWED_HOSTS,
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };

    app.use(cors(corsOptions));
    app.use(express.static(path.join(__dirname, 'public')));

    app.put(
        '/api/room/create',
        express.json(),
        async (req: Request, res: Response) => {
            // TODO: Add error handling for if room already exists
            //console.log("create body", req.body);
            console.log('create');
            let [status, data] = await createRoomFromRequest(req);
            res.status(status).send(data);
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        }
    );

    app.put(
        '/api/room/add_player',
        express.json(),
        async (req: Request, res: Response) => {
            // console.log("add_player body", req.body);
            console.log('add_player');
            try {
                let [status, data] = await addPlayerToRoomFromRequest(req);
                if (typeof status === 'number') {
                    //console.log("status:", status, "data:", data);
                    res.status(status).send(data);
                } else {
                    res.status(500).send(data);
                }
            } catch (error) {
                console.log(error);
                res.status(400).send({});
            }
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        }
    );

    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    return app;
}
