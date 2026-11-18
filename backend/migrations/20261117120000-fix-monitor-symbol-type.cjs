'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('monitors', 'symbol', {
      type: Sequelize.STRING(20),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('monitors', 'symbol', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
