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
        if (results.length) 
            results.forEach((result) => WSS.broadcast({ notification: result }));
        
    })

    logger("M-TICKER", "Ticker monitor has started!");
}

async function loadWallet(userId, executeAutomations = true) {
    const exchange = new Exchange();
  
    const info = await exchange.balance();
    const beholder = Beholder.getInstance();
    let results = await Promise.all(
        Object.keys(info).map(item => beholder.updateMemory(item, `WALLET_${userId}`, null, info[item].available, executeAutomations))
    );

    
     
    const wallet = Object.keys(info).map(item => {
        return { symbol: item, available: info[item].available, onOrder: info[item].onOrder };
    });

    if (results) {
       results = results.filter((result) => result);
        if (results.length) 
            results.forEach((result) => WSS.broadcast({ notification: result }));
    }
    return wallet;

}
''
function startUserDataMonitor(userId) {
    try {
        loadWallet(userId, false)
            .catch(err => logger("U-" + userId, "Wallet has NOT loaded!\n" + (err.body ? JSON.stringify
                (err.body) : err.message)));

        //configurar streaming de user data

        logger("U-" + userId, "User Data monitor has started!");
    }
    catch (err) {
        logger("U-" + userId, "User Data monitor has not started!\n" + (err.body ? JSON.stringify(err.body) : err.message));
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
