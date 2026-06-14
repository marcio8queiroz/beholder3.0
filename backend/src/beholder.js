import Cache from "./utils/cache.js";

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

    async setCache(symbol, index, interval, value, executeAutomations = true) {
        return true; //implementar a lógica de cache
    }

    async updateTickerMemory(symbol, index, value, executeAutomations = true) {
       this.setCache(symbol, index, null, value, executeAutomations);
    }

    async updateMemory(symbol, index, interval, value, executeAutomations = true) {
        if (value === undefined || value === null) return false;
        if (value.toJSON) value = value.toJSON();
        if (value.get) value = value.get({ plain: true }); //so tras os dados essenciais do sequelize

        if(index === "TICKER") 
            return this.updateTickerMemory(symbol, index, value, executeAutomations);
        else
            return this.setCache(symbol, index, value, executeAutomations);
    }
}