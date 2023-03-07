import express from 'express'
import { fileURLToPath } from 'url';
import path from 'path';

const port = process.env.SERVER_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function startServer() {
    const server = express();

    server.use(express.static(path.join(__dirname, 'public')));

    server.get('/*', (req, res) => {
        console.log(req.url);
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    server.listen(port);
}