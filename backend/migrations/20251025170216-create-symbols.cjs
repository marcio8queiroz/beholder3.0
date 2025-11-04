'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("symbols", {
      symbol:{
        type: Sequelize.STRING(20),
        allowNull: false,
        primaryKey: true
      },
      base: {  //btc
        type: Sequelize.STRING(20),
        allowNull: false
      },
      quote: { //usdt
        type: Sequelize.STRING(20),
        allowNull: false
      },
      stepSize: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tickSize: {
        type: Sequelize.STRING,
        allowNull: false
      },
      basePrecision: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quotePrecision: {
        type: Sequelize.INTEGER,
        allowNull: false
      }, 
      minNotional: {
        type: Sequelize.STRING,
        allowNull: false
      },
      minLoteSize: {
        type: Sequelize.STRING(20),
      },
      CreatedAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable("symbols");
  }
};
