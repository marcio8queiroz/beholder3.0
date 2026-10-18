import test from 'node:test';
import assert from 'node:assert/strict';
import Binance from 'node-binance-api';
import Exchange from '../src/utils/exchange.js';
import Beholder from '../src/beholder.js';

test('full market ticker stream passes converted batches into memory', async () => {
    const exchange = Object.create(Exchange.prototype);
    exchange.binance = new Binance();
    let endpoint, onMessage;
    exchange.binance.subscribeCombined = (stream, handler) => {
        endpoint = stream;
        onMessage = handler;
        return { url: 'test-stream' };
    };
    const beholder = new Beholder([]);
    let received, update;
    const url = exchange.tickerStream(markets => {
        received = markets;
        update = Promise.all(markets.map(market =>
            beholder.updateMemory(market.symbol, 'TICKER', null, market)));
        return update;
    }, ['BTCUSDT', 'ETHUSDT', 'BTCUSDT']);
    assert.deepEqual(endpoint, ['btcusdt@ticker', 'ethusdt@ticker']);
    assert.deepEqual(url, ['test-stream']);
    onMessage({
        s: 'BTCUSDT', p: '10', P: '1', w: '995', x: '990', c: '1000',
        Q: '0.1', b: '999', B: '2', a: '1001', A: '3', o: '990',
        h: '1010', l: '980', v: '100', q: '99500'
    });
    assert.ok(Array.isArray(received));
    assert.equal(received[0].symbol, 'BTCUSDT');
    await update;
    const { current } = await beholder.getMemory('BTCUSDT', 'TICKER');
    assert.equal(current.averagePrice, 995);
    assert.equal(current.percentChange, 1);
    assert.equal(current.prevClose, 990);
    assert.equal(current.closeQty, 0.1);
    assert.equal(current.bestBid, 999);
    assert.equal(current.bestAskQty, 3);
    assert.ok(Object.values(current).every(Number.isFinite));
});
