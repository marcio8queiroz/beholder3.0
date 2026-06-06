import logger from "./utils/logger.js";
import Exchange from "./utils/exchange.js";

function startTickerMonitor(){
    new Exchange().tickerStream(async (markets) => {
        console.log(markets);
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