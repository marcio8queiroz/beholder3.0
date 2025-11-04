import symbolsRepository from "../repositories/symbolsRepository.js"
import Exchange from "../utils/exchange.js"

async function syncSimbols(params) {
    const exchange = new Exchange();
    const data = await exchange.exchangeInfo();
    data.symbols.map(item => {
        
    })
}

export default {
    syncSimbols
}