import express from 'express'
import { fileURLToPath } from 'url';
import cors from 'cors';
import path from 'path';
import { config } from './src/config.js';

const port = process.env.SERVER_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function startServer() {
    const server = express();
    console.log(config.ALLOWED_HOSTS);
    console.log(port);
    var corsOptions = {
        origin: config.ALLOWED_HOSTS,
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    
    server.use(cors(corsOptions));
    server.use(express.static(path.join(__dirname, 'public')));

    server.put('/api/room/create', express.json(), async (req, res) => {
        console.log(req.body);
        
        res.send({
            response: "goose"
        });
    });

    server.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    server.listen(port);
}