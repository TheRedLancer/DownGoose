import express, {Request, Response} from 'express';
import {fileURLToPath} from 'url';
import cors from 'cors';
import path from 'path';
import {config} from './config.js';
import {addPlayerToRoomCode, createGameRoom} from './dbFunctions.js';

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
            console.log('create room');
            try {
                const data = await createGameRoom(req.body.roomCode);
                res.status(201).send(data);
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e);
                    switch (e.message) {
                        case DGERROR.RoomExists:
                            res.status(409).send({
                                message: DGERROR.RoomExists,
                            });
                            break;
                        case DGERROR.UnknownRedisError:
                        // Fallthrough on purpose
                        case DGERROR.FailCreateRoom:
                            res.status(409).send({
                                message: DGERROR.FailCreateRoom,
                            });
                            break;
                        default:
                            res.status(500).send({
                                message: 'InternalServerError',
                            });
                    }
                    res.status(500).send({message: e.message});
                }
            }
            res.status(500).send({message: 'InternalServerError'});
        }
    );

    app.put(
        '/api/room/add_player',
        express.json(),
        async (req: Request, res: Response) => {
            console.log('add_player');
            try {
                let [room, player] = await addPlayerToRoomCode(
                    req.body.roomCode,
                    req.body.nickname
                );
                // TODO: Add send to client
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e);
                    switch (e.message) {
                        case DGERROR.UnknownRedisError:
                        // Fallthrough on purpose
                        case DGERROR.RoomNotFound:
                            res.status(404).send({
                                message: DGERROR.RoomNotFound,
                            });
                            break;
                        default:
                            res.status(500).send({
                                message: 'InternalServerError',
                            });
                    }
                    res.status(500).send({message: e.message});
                }
            }
            res.status(500).send({message: 'InternalServerError'});
        }
    );

    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    return app;
}
