"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("DispenserSpendingLines", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      opened_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      closed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      flow_volume: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      total_spent: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      dispenser_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Dispensers",
          key: "id",
        },
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("DispenserSpendingLines");
  },
};
