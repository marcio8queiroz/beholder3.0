import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
import logger from './utils/logger.js';

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
    if(!this.clients) return;

    this.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    })
}

export default function init(server) {
    const wss = new WebSocketServer({ 
        server 
    });
    wss.on("connection", onConnection) 
    logger("system", "WebSocket server has started!");
    wss.broadcast = broadcast;
    return wss;
}