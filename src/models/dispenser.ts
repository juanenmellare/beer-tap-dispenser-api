import { sequelize } from '../databases';

import { Model, DataTypes } from 'sequelize';
import { DispenserSpendingLine } from '../models';

class Dispenser extends Model {
  public readonly id!: string;
  public readonly flowVolume!: number;

  public readonly dispenserSpendingLines?: DispenserSpendingLine[];
}

Dispenser.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    flowVolume: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: 'Dispensers',
    ...sequelize,
  },
);

export default Dispenser;
