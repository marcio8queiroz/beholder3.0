import logger from "./utils/logger.js";
import Exchange from "./utils/exchange.js";
import Beholder from "./beholder.js";

function startTickerMonitor() {
    new Exchange().tickerStream(async (markets) => {
        const beholder = Beholder.getInstance();
        let results = await Promise.all(
            markets.map((mkt) => beholder.updateMemory(mkt.symbol, "TICKER", null, mkt))
        );

        if (!results) return;

        results = results.filter((result) => result);
        if (results.length) {
            results.forEach((result) => WSS.broadcast({ notification: result }));
        }
    });

    logger("M-TICKER", "Ticker monitor has started!");
}

function startUserDataMonitor(userId) {
    try {
        //carregar saldos da carteira 

        //configurar streaming de user data

        logger("U-" + userId, "User Data monitor has started!");
    }
    catch (err) {
        logger("U-" + userId, "User Data monitor has not started!\n" + (err.response ? JSON.stringify(err.response.data)
            : err.message));
    }
}

let WSS;

function init(userId, wssInstance) {
    WSS = wssInstance;

    startTickerMonitor();

    startUserDataMonitor(userId);

    //carregar últimas ordens executadas

    // monitoramento de ativos (candles)

    logger("system", "App Exchange Monitor has started!");
}

export default {
    init
};
