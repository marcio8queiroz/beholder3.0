import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { createHmac } from 'node:crypto';
import stream from '../src/utils/userDataStream.js';

class Socket extends EventEmitter {
    static instances = [];
    constructor(url) { super(); this.url = url; this.sent = []; Socket.instances.push(this); }
    send(raw, cb) { this.sent.push(JSON.parse(raw)); cb(); }
    terminate() { if (!this.closed) { this.closed = true; this.emit('close'); } }
    message(data) { this.emit('message', JSON.stringify(data)); }
}
const tick = () => new Promise(resolve => setImmediate(resolve));
function setup(t, options = {}) {
    const errors = [], balances = [], executions = [], subscriptions = [];
    const client = stream({ apiKey: 'key', apiSecret: 'secret', testnet: true, Socket,
        onBalance: e => balances.push(e), onExecution: e => executions.push(e),
        onSubscribed: id => subscriptions.push(id), onError: e => errors.push(e.message), ...options });
    t.after(() => client.close());
    return { client, ws: Socket.instances.at(-1), errors, balances, executions, subscriptions };
}
function subscribe(ws) {
    ws.emit('open');
    ws.message({ id: 'time', status: 200, result: { serverTime: 123456 } });
    ws.message({ id: 'subscribe', status: 200, result: { subscriptionId: 0 } });
}
test('signs subscription using server time and routes wrapped account events', async t => {
    const { ws, balances, executions, subscriptions } = setup(t);
    subscribe(ws);
    assert.equal(ws.url, 'wss://ws-api.testnet.binance.vision/ws-api/v3');
    assert.equal(ws.sent[1].method, 'userDataStream.subscribe.signature');
    assert.equal(ws.sent[1].params.signature, createHmac('sha256', 'secret')
        .update('apiKey=key&recvWindow=5000&timestamp=123456').digest('hex'));
    for (const e of ['balanceUpdate', 'outboundAccountPosition', 'executionReport'])
        ws.message({ subscriptionId: 0, event: { e } });
    ws.message({ subscriptionId: 99, event: { e: 'executionReport' } });
    await tick();
    assert.deepEqual(subscriptions, [0]);
    assert.equal(balances.length, 2);
    assert.equal(executions.length, 1);
});
test('authentication failure is reported and reconnects; close stops retries', async t => {
    const { ws, errors, client, subscriptions } = setup(t, { retryMs: 5 });
    ws.emit('open');
    ws.message({ id: 'time', status: 200, result: { serverTime: 123 } });
    ws.message({ id: 'subscribe', status: 401, error: { code: -2015, msg: 'Invalid API-key' } });
    assert.ok(errors.some(e => e.includes('-2015')));
    assert.equal(subscriptions.length, 0);
    await new Promise(resolve => setTimeout(resolve, 20));
    const replacement = Socket.instances.at(-1);
    assert.notEqual(replacement, ws);
    subscribe(replacement);
    client.close();
    const count = Socket.instances.length;
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.equal(Socket.instances.length, count);
});
test('callback rejection is caught without terminating the stream', async t => {
    const { ws, errors } = setup(t, { onExecution: async () => { throw new Error('callback failed'); } });
    subscribe(ws);
    ws.message({ subscriptionId: 0, event: { e: 'executionReport' } });
    await tick();
    assert.ok(errors.includes('callback failed'));
    assert.ok(!ws.closed);
});
test('request timeout is handled and production uses production endpoint', async t => {
    const { ws, errors } = setup(t, { testnet: false, timeoutMs: 5 });
    assert.equal(ws.url, 'wss://ws-api.binance.com:443/ws-api/v3');
    ws.emit('open');
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.ok(ws.closed);
    assert.ok(errors.some(e => e.includes('timed out')));
});
