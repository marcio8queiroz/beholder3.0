import Binance from "node-binance-api";

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
        this.binance.websockets.userData(
            () => {},
            balanceCallback,
            executionCallback,
            data => {
                logger("U-" + this.userId, "userDataStream:subscribed:" + JSON.stringify(data));
                this.binance.options.listenKey = data;

            },
            () => { }
        );       
    }
}