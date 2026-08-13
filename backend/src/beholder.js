import Cache from "./utils/cache.js";


const LOGS = process.env.BEHOLDER_LOGS === "true";

export default class Beholder {

    static instance;

    static getInstance(automations = []) {
        if (!Beholder.instance)
            Beholder.instance = new Beholder(automations);
        return Beholder.instance;
    }

    constructor(automations) {
        //inicializar a memória
        this.cache = new Cache();
        //inicializar o cérebro
    }

    static FIAT_COINS = ["BRL", "EUR", "GBP"];

    static DOLLAR_COINS = ["USDT", "USD", "USDC", "FDUSD", "USTC"];

    async getStableConversion(baseAsset, quoteAsset, baseQty) {
        if (Beholder.DOLLAR_COINS.includes(baseAsset)) return baseQty;

        const ticker = await this.getMemory(`${baseAsset + quoteAsset}`, "TICKER");
        if(ticker && ticker.current) return parseFloat(baseQty) * (ticker.current.close);
        return 0;
    }

    async getFiatConversion(stablecoin, fiatCoin, fiatQty) {
        const ticker = await this.getMemory(`${stablecoin}${fiatCoin}`, "TICKER");
        if(ticker && ticker.current) return parseFloat(fiatQty) / (ticker.current.close);
        return 0;
    }

    async tryUsdConversion(baseAsset, baseQty) {
       if (Beholder.DOLLAR_COINS.includes(baseAsset)) return baseQty;
       if (Beholder.FIAT_COINS.includes(baseAsset)) return this.getFiatConversion("USDT", baseAsset, baseQty);
       
       for(let i=0; i<Beholder.DOLLAR_COINS.length; i++){
            const converted = await this.getStableConversion(baseAsset, Beholder.DOLLAR_COINS[i], baseQty);
            if(converted > 0) return converted;
       }

       return 0;
    }

    async tryFiatConversion(baseAsset, baseQty, fiat) {
        if(fiat) fiat = fiat.toUpperCase();
        if(Beholder.FIAT_COINS.includes(baseAsset) && baseAsset === fiat) return baseQty;

        const usd = this.tryFiatConversion(baseAsset, baseQty);
        if(fiat === "USD" || !fiat) return usd;

        let ticker = await this.getMemory("USDT" + fiat, "TICKER");
        if(ticker && ticker.current) return parseFloat(usd) * (ticker.current.close);

        ticker = await this.getMemory(fiat + "USDT", "TICKER");
        if(ticker && ticker.current) return parseFloat(usd) / (ticker.current.close);

        return usd;
    }

    buildMemoryKey(symbol, index, interval = undefined) {
        const indexKey = interval ? `${index}:${interval}` : index;
        return `${symbol}:${indexKey}`;
    }

    async setCache(symbol, index, interval, value, executeAutomations = true) {
        const memoryKey = this.buildMemoryKey(symbol, index, interval);

        if (LOGS) logger("beholder", `Beholder memory update: ${memoryKey} => ${JSON.stringify(value)}`);

        this.cache.set(memoryKey, value);

        //testa as automações
    }

    async getMemory(symbolOrKey, index = undefined, interval = undefined) {
        if (symbolOrKey && index) {
            const memoryKey = this.buildMemoryKey(symbolOrKey, index, interval);
            return this.cache.get(memoryKey);
        }
        else if (symbolOrKey)
            return this.cache.get(symbolOrKey);
        else
            return this.cache.search();
    }

    async updateTickerMemory(symbol, index, originalTicker, executeAutomations = true) {

        const ticker = originalTicker;
        
        ticker.close = parseFloat(ticker.close);
        ticker.open = parseFloat(ticker.open);
        ticker.high = parseFloat(ticker.high);
        ticker.low = parseFloat(ticker.low);
        ticker.volume = parseFloat(ticker.volume);
        ticker.quoteVolume = parseFloat(ticker.quoteVolume);

        delete ticker.eventTime;
        delete ticker.symbol;

        const currentMemory = await this.getMemory(symbol, index);

        const newMemory = {};
        newMemory.previous = currentMemory ? currentMemory.current : ticker;
        newMemory.current = ticker;

        this.setCache(symbol, index, null, newMemory, executeAutomations);
    }

    async updateMemory(symbol, index, interval, value, executeAutomations = true) {
        if (value === undefined || value === null) return false;
        if (value.toJSON) value = value.toJSON();
        if (value.get) value = value.get({ plain: true }); //so tras os dados essenciais do sequelize

        if (index === "TICKER")
            return this.updateTickerMemory(symbol, index, value, executeAutomations);
        else
            return this.setCache(symbol, index, interval, value, executeAutomations);
    }
}