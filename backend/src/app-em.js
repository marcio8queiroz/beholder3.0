import logger from "./utils/logger.js";
import Exchange from "./utils/exchange.js";
import Beholder from "./beholder.js";


const LOGS = process.env.APP_EM_LOGS === "true";

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
    let results = await Promise.all(Object.keys(info).map(async item => {
        if(executeAutomations) {
        const memory = await beholder.getMemory(`WALLET_${userId}`);
        if (memory === info[item].available) return;
        }

        beholder.updateMemory(item, `WALLET_${userId}`, null, info[item].available, executeAutomations)

    }));

    
     
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

async function processBalanceData(userId, data) {
    if(LOGS) logger("U-" + userId, JSON.stringify(data));

    loadWallet(userId, true)
        .catch(err => logger("U-" + userId, err.body ? JSON.stringify(err.body) : err.message));
}

async function processExecutionData(userId, data) {
   
}

function startUserDataMonitor(userId) {
    try {
        loadWallet(userId, false)
            .catch(err => logger("U-" + userId, "Wallet has NOT loaded!\n" + (err.body ? JSON.stringify
                (err.body) : err.message)));
 
        const exchange = new Exchange(userId);
        exchange.userDataStream(
            data => processBalanceData(userId, data),
            data => processExecutionData(userId, data)
        )

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
