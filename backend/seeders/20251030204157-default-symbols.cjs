'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up (queryInterface, Sequelize) {
// CORREÇÃO: Usamos import() dinâmico para importar um módulo ES (symbolsController.js)
// a partir de um módulo CommonJS (.cjs), conforme sugerido pelo Node.js.
const symbolsControllerModule = await import("../src/controllers/symbolsController.js");
const symbolsController = symbolsControllerModule.default || symbolsControllerModule;

// A linha abaixo pressupõe que a função syncSymbols está sendo exportada
// como export default ou como uma propriedade do objeto exportado.
await symbolsController.syncSymbols();


},

async down (queryInterface, Sequelize) {
return queryInterface.bulkDelete("symbols");
}
}; 