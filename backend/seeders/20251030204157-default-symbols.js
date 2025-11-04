'use strict';

import symbolsController from "../src/controllers/symbolsController";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await symbolsController.syncSymbols();
    
  },

  async down (queryInterface, Sequelize) {
   return queryInterface.bulkDelete("symbols");
  }
};
