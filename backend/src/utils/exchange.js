import Binance from "node-binance-api";
import logger from "./logger.js";
import createUserDataStream from "./userDataStream.js";

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

    tickerStream(callback){
        this.binance.websockets.miniTicker((data) => {
           const converted = Object.keys(data).map(key => {
                return {
                    symbol: key,
                    ...data[key]
                }
           });
            callback(converted);
        }, true);
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
}
