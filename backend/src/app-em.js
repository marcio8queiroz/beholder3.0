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
    if(data.x === "NEW") return; //ignorar ordens novas, apenas monitorar ordens executadas 

    if(LOGS) logger("U-" + userId, JSON.stringify(data));

    const order = {
        symbol: data.s,
        orderId: data.i, 
        side: data.S,
        type: data.o,
        status: data.X,
        transactTime: data.T
    }

    if(order.status === "FILLED") {
        const quoteAmount = parseFloat(data.Z);
        order.avgPrice = quoteAmount / parseFloat(data.z);
        order.commission = data.n;  
        order.quantity = data.q;
        const isQuotCommission = data.N && order.symbol.endWith(data.N); //verificar se a comissão é em moeda de cotação ou moeda base
        order.net = isQuotCommission ? quoteAmount - parseFloat(order.commission) : quoteAmount;
    }
    else if(order.status === "REJECTED") 
        order.obs = data.r;

    //order update
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
