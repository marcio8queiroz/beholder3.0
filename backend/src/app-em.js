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

async function init(userId) {

    startTickerMonitor();

    //monitoramento do mercado (geral)

    //monitoramento da conta do usuário

    //monitoramento de ativos (candles)

    logger("system", "App Exchange Monitor has started!");
}

export default {
    init
}