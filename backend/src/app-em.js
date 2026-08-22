import logger from "./utils/logger.js";
import Exchange from "./utils/exchange.js";
import Beholder from "./beholder.js";

function startTickerMonitor(){
    new Exchange().tickerStream(async (markets) => {
       const beholder = Beholder.getInstance();
       let results = await Promise.all(markets.map(mkt => beholder.updateMemory(mkt.symbol, "TICKER", null, mkt)));
       if(!results) return;

       results = results.filter(r => r);
       if(results && results.length)
       results.map(r => WSS.broadcast({ notification: r }));//{ text, type: success|error }
    })

    logger("M-TICKER", "Ticker monitor has started!");
}

let WSS;

function init(userId, wssInstance) {
    WSS = wssInstance;
   

    startTickerMonitor();

    //monitoramento da conta do usuário

    //monitoramento de ativos (candles)

    logger("system", "App Exchange Monitor has started!");
}



export default {
    init
}