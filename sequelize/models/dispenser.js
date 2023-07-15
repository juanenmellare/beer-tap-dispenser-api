'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dispenser = sequelize.define('Dispenser', {
    flow_volume: DataTypes.FLOAT
  }, {});
  Dispenser.associate = function(models) {
    // associations can be defined here
  };
  return Dispenser;
};