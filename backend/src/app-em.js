import logger from "./utils/logger.js";
import Exchange from "./utils/exchange.js";
import Beholder from "./beholder.js";

function startTickerMonitor(){
    new Exchange().tickerStream(async (markets) => {
       const beholder = Beholder.getInstance();
       markets.forEach(mkt => beholder.updateMemory(mkt.symbol, "TICKER", null, mkt));

       //notificar o usuário se disparou alguma automação
    })

    logger("M-TICKER", "Ticker monitor has started!");
}

let WSS;

async function init(userId, wssInstance) {
    WSS = wssInstance;
   setInterval(() => WSS.broadcast({ message: new Date()}), 3000);

    startTickerMonitor();

    //monitoramento da conta do usuário

    //monitoramento de ativos (candles)

    logger("system", "App Exchange Monitor has started!");
}



export default {
    init
}