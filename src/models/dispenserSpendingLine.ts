import { sequelize } from '../databases';

import { Model, DataTypes } from 'sequelize';

interface IDispenserSpendingLineUpdateFields {
  totalSpent?: number;
  openedAt?: Date;
  closedAt?: Date;
}

class DispenserSpendingLine extends Model implements IDispenserSpendingLineUpdateFields {
  public readonly id!: number;
  public readonly flowVolume!: number;
  public readonly dispenserId!: string;
  public totalSpent?: number;
  public openedAt?: Date;
  public closedAt?: Date;
}

DispenserSpendingLine.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    openedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    flowVolume: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalSpent: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dispenserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: 'DispenserSpendingLines',
    ...sequelize,
  },
);

const asDispenserSpendingLines = 'dispenserSpendingLines';

export { IDispenserSpendingLineUpdateFields, asDispenserSpendingLines };
export default DispenserSpendingLine;
