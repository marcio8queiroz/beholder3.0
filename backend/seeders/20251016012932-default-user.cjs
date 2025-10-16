'use strict';

// 1. Correção: Carrega o módulo Sequelize para usar 'Op'
//const { Op } = require('sequelize');

// 2. Correção: Carrega o módulo dotenv e o executa.
const dotenv = require("dotenv");
dotenv.config();

// 3. Correção: Carrega o módulo bcryptjs (ou bcrypt)
const bcrypt = require("bcryptjs"); // Note que renomeamos a constante para 'bcrypt'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Verifica se já existe algum usuário na tabela 'users'
    // OBSERVAÇÃO: Use rawSelect, não rawSelect, e o nome da tabela deve estar correto
    const userId = await queryInterface.rawSelect("users", { where: {}, limit: 1 },["id"]);
    if(userId) return;

    return queryInterface.bulkInsert("users", [{
      name: "Beholder User",
      email: process.env.DEFAULT_USER_EMAIL,
      // 4. Correção: Usar a constante 'bcrypt' com o método hashSync
      password: bcrypt.hashSync(process.env.DEFAULT_USER_PWD), 
      telegramChat: process.env.DEFAULT_USER_TELEGRAM_CHAT,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
  },

  async down (queryInterface, Sequelize) {
    // Reverte a inserção, deletando o usuário padrão
    return queryInterface.bulkDelete('users');
  } 
};

