import { createHmac } from "node:crypto";
import WebSocket from "ws";

// Spot WebSocket API: replaces the retired REST listenKey endpoint.
export default function userDataStream({ apiKey, apiSecret, testnet,
    onBalance, onExecution, onSubscribed = () => {}, onError = () => {},
    Socket = WebSocket, retryMs = 1000, timeoutMs = 15000 }) {
    const url = testnet
        ? "wss://ws-api.testnet.binance.vision/ws-api/v3"
        : "wss://ws-api.binance.com:443/ws-api/v3";
    let socket, retryTimer, stopped = false, attempts = 0;

    const report = error => onError(error instanceof Error ? error : new Error(String(error)));
    const invoke = (callback, data) => {
        Promise.resolve().then(() => callback(data)).catch(report);
    };
    function connect() {
        if (stopped) return;
        const ws = socket = new Socket(url, { handshakeTimeout: timeoutMs });
        let deadline, heartbeat, subscriptionId;
        const fail = error => {
            report(error);
            ws.terminate();
        };
        const armDeadline = () => {
            clearTimeout(deadline);
            deadline = setTimeout(() => fail(new Error("User stream request timed out")), timeoutMs);
        };
        const alive = () => {
            clearTimeout(heartbeat);
            heartbeat = setTimeout(() => fail(new Error("User stream heartbeat timed out")), 60000);
        };
        const send = request => {
            armDeadline();
            ws.send(JSON.stringify(request), error => { if (error) fail(error); });
        };
        ws.on("open", () => {
            alive();
            // Use Binance time so local clock drift does not break authentication.
            send({ id: "time", method: "time" });
        });
        // ws automatically replies to Binance ping frames with the same payload.
        ws.on("ping", alive);
        ws.on("message", raw => {
            try {
                const data = JSON.parse(raw.toString());
                if (data.id === "time" || data.id === "subscribe") {
                    clearTimeout(deadline);
                    if (data.status !== 200) {
                        // Never log the request, API key or signature.
                        throw new Error(`User stream ${data.id} failed (${data.error?.code ?? data.status}): ${data.error?.msg ?? "Request rejected"}`);
                    }
                    if (data.id === "time") {
                        if (!Number.isFinite(data.result?.serverTime)) throw new Error("Invalid Binance server time");
                        const params = { apiKey, recvWindow: 5000, timestamp: data.result.serverTime };
                        const payload = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join("&");
                        params.signature = createHmac("sha256", apiSecret).update(payload).digest("hex");
                        send({ id: "subscribe", method: "userDataStream.subscribe.signature", params });
                    } else {
                        subscriptionId = data.result?.subscriptionId;
                        if (!Number.isInteger(subscriptionId)) throw new Error("Invalid subscription ID");
                        attempts = 0;
                        invoke(onSubscribed, subscriptionId);
                    }
                    return;
                }
                const event = data.event;
                if (event?.e === "serverShutdown" || data.e === "serverShutdown") {
                    ws.terminate();
                    return;
                }
                if (subscriptionId === undefined || data.subscriptionId !== subscriptionId) return;
                if (event?.e === "eventStreamTerminated") ws.terminate();
                else if (event?.e === "outboundAccountPosition" || event?.e === "balanceUpdate") invoke(onBalance, event);
                else if (event?.e === "executionReport") invoke(onExecution, event);
            } catch (error) {
                fail(error);
            }
        });
        ws.on("error", fail);
        ws.on("close", () => {
            clearTimeout(deadline);
            clearTimeout(heartbeat);
            if (!stopped) {
                const delay = Math.min(retryMs * 2 ** Math.min(attempts++, 6), 60000);
                report(new Error(`User stream disconnected; reconnecting in ${delay}ms`));
                retryTimer = setTimeout(connect, delay);
            }
        });
    }
    connect();
    return {
        close() {
            stopped = true;
            clearTimeout(retryTimer);
            socket.terminate();
        }
    };
}
