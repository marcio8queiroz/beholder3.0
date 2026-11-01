import Binance from "node-binance-api";
import logger from "./logger.js";
import createUserDataStream from "./userDataStream.js";
import ordersRepository from "../repositories/ordersRepository.js";

const LOGS = process.env.BINANCE_LOGS === "false"
const APIKEY = process.env.ACCES_KEY;
const APISECRET = process.env.SECRET_KEY;

export default class Exchange {
    constructor(userId) {
        if(!APIKEY || !APISECRET) throw new Error("Binance keys not found!");
        this.userId = userId;
        this.binance = new Binance().options({
            APIKEY,
            APISECRET,
            family: 0,
            test: process.env.NODE_ENV !== "production",
            verbose: LOGS
        })
    }

    exchangeInfo(){
        return this.binance.exchangeInfo();
    }

    async balance(){
        await this.binance.useServerTime(); //reduzir erros de timestamp - relogio do servidor
        return this.binance.balance();
    }

    tickerStream(callback, symbols){
        const uniqueSymbols = [...new Set(symbols)];
        const subscriptions = [];
        // !ticker@arr was retired; subscribe to full tickers by symbol.
        // Keep combined-stream URLs and subscription counts bounded.
        for (let offset = 0; offset < uniqueSymbols.length; offset += 200) {
            const batch = uniqueSymbols.slice(offset, offset + 200);
            subscriptions.push(this.binance.websockets.prevDay(batch, (error, market) => {
                if (error) {
                    logger("M-TICKER", "Ticker stream error: " + error.message);
                    return;
                }
                return callback([market]);
            }));
        }
        return subscriptions;
    }

    userDataStream(balanceCallback, executionCallback){
        this.userStream?.close();
        this.userStream = createUserDataStream({
            apiKey: APIKEY,
            apiSecret: APISECRET,
            testnet: process.env.NODE_ENV !== "production",
            onBalance: balanceCallback,
            onExecution: executionCallback,
            onSubscribed: subscriptionId => {
                logger("U-" + this.userId, "User Data monitor has started! Subscription: " + subscriptionId);
            },
            onError: error => logger("U-" + this.userId, "User Data monitor: " + error.message)
        });
        return this.userStream;
    }

    buy(symbol, quantity, price, options){
        if(!options || options.type === ordersRepository.orderTypes.MARKET)
            return this.balance.marketBuy(symbol, quantity, options);

        return this.binance.buy(symbol, quantity, price, options);
    }

    sell(symbol, quantity, price, options){
        if(!options || options.type === ordersRepository.orderTypes.MARKET)
            return this.balance.marketSell(symbol, quantity, options);

        return this.binance.sell(symbol, quantity, price, options);
    }
}
