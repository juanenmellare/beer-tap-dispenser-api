'use strict';
module.exports = (sequelize, DataTypes) => {
  const DispenserSpendingLine = sequelize.define('DispenserSpendingLine', {
    opened_at: DataTypes.DATE,
    closed_at: DataTypes.DATE,
    flow_volume: DataTypes.FLOAT,
    total_spent: DataTypes.FLOAT
  }, {});
  DispenserSpendingLine.associate = function(models) {
    // associations can be defined here
  };
  return DispenserSpendingLine;
};