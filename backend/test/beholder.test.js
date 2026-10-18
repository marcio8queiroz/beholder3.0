import test from 'node:test';
import assert from 'node:assert/strict';
import Beholder from '../src/beholder.js';

test('miniTicker keeps missing fields as null and preserves previous and current snapshots', async () => {
    const beholder = new Beholder([]);
    const ticker = {
        symbol: 'BTCUSDT', close: '82118.01', open: '80660.82',
        high: '82656.04', low: '66745.57', volume: '634.15275',
        quoteVolume: '51652370.6866338', eventTime: 123
    };
    await beholder.updateMemory('BTCUSDT', 'TICKER', null, ticker);
    ticker.close = '83000';
    await beholder.updateMemory('BTCUSDT', 'TICKER', null, ticker);
    const memory = await beholder.getMemory('BTCUSDT', 'TICKER');
    assert.equal(memory.previous.close, 82118.01);
    assert.equal(memory.current.close, 83000);
    assert.equal(ticker.symbol, 'BTCUSDT');
    assert.equal(ticker.eventTime, 123);
    const availableFields = ['close', 'open', 'high', 'low', 'volume', 'quoteVolume'];
    const missingFields = ['priceChange', 'percentChange', 'averagePrice', 'prevClose',
        'closeQty', 'bestBid', 'bestBidQty', 'bestAsk', 'bestAskQty'];
    for (const snapshot of [memory.previous, memory.current]) {
        for (const field of availableFields) assert.ok(Number.isFinite(snapshot[field]));
        for (const field of missingFields) assert.equal(snapshot[field], null);
        assert.deepEqual(JSON.parse(JSON.stringify(snapshot)), snapshot);
    }
});

test('full ticker preserves zero and represents invalid numeric values as null', async () => {
    const beholder = new Beholder([]);
    await beholder.updateMemory('BTCUSDT', 'TICKER', null, {
        close: '100', priceChange: '0', bestBid: '99', averagePrice: null,
        bestAsk: 'invalid', volume: Infinity
    });
    const { current } = await beholder.getMemory('BTCUSDT', 'TICKER');
    assert.equal(current.close, 100);
    assert.equal(current.priceChange, 0);
    assert.equal(current.bestBid, 99);
    assert.equal(current.averagePrice, null);
    assert.equal(current.bestAsk, null);
    assert.equal(current.volume, null);
    assert.ok(Object.values(current).every(value => value === null || Number.isFinite(value)));
});
