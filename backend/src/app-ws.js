import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
import logger from './utils/logger.js';
import jwt from 'jsonwebtoken';
import authController from './controllers/authController.js';

function onMessage(data) {
    logger("system", `app-ws.onMessage: ${data}`);
}

function onError(err) {
    logger("system", `app-ws.onError: ${err.message}`);
}

function onConnection(ws, req) {
    ws.on("message", onMessage);
    ws.on("error", onError);
    logger("system", "app-ws.onConnection");

}

function broadcast(data) {
    if (!this.clients) return;

    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}


const CORS_ORIGIN = process.env.CORS_ORIGIN;
function corsValidation(origin) {
    return CORS_ORIGIN === origin || CORS_ORIGIN === "*";
}

function verifyClient(info, callback) {
    if (!corsValidation(info.origin)) return callback(false, 401);

    const requestUrl = new URL(info.req.url, 'http://localhost');
    const token = requestUrl.searchParams.get('token');
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const isBlacklisted = authController.isBlacklisted(token);
            if (decoded && !isBlacklisted) 
                return callback(true);
        }
        catch (err) {
            logger("system", err);
        }
    }

    return callback(false, 401);
}


export default function init(server) {
    const wss = new WebSocketServer({
        server,
        verifyClient
    });
    wss.on("connection", onConnection);
    logger("system", "WebSocket server has started!");
    wss.broadcast = broadcast;
    return wss;

}
