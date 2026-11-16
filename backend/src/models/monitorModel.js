import Sequelize from "sequelize";
import database from "../db.js";

const MonitorModel = database.define("monitor", {
     id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        },      
      symbol: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      interval: Sequelize.STRING,
      indexes: Sequelize.STRING,
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      logs: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })

export default MonitorModel;
