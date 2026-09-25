import { Op } from 'sequelize';
import database from '../src/db.js';
import symbolModel from '../src/models/symbolModel.js';
import Exchange from '../src/utils/exchange.js';

try {
    const symbols = await symbolModel.findAll({
        attributes: ['symbol'],
        where: { minLoteSize: { [Op.is]: null } },
        raw: true,
        logging: false
    });
    if (!symbols.length) {
        console.log('No symbols with NULL minLoteSize.');
    } else {
        const info = await new Exchange().exchangeInfo();
        const quantities = new Map(info.symbols.map(item => [
            item.symbol, item.filters.find(filter => filter.filterType === 'LOT_SIZE')?.minQty
        ]));
        let updated = 0;
        const unavailable = [];
        await database.transaction(async transaction => {
            for (const { symbol } of symbols) {
                const minQty = quantities.get(symbol);
                if (typeof minQty !== 'string' || !/^\d+(\.\d+)?$/.test(minQty)) {
                    unavailable.push(symbol);
                    continue;
                }
                const [count] = await symbolModel.update({ minLoteSize: minQty }, {
                    where: { symbol, minLoteSize: { [Op.is]: null } },
                    transaction, logging: false
                });
                updated += count;
            }
        });
        console.log(JSON.stringify({ updated, unavailable }));
        if (unavailable.length) process.exitCode = 1;
    }
} catch (error) {
    console.error('Repair failed:', error.message);
    process.exitCode = 1;
} finally {
    await database.close();
}
