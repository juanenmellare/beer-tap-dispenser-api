import Dispenser from './dispenser';
import DispenserSpendingLine, {
  IDispenserSpendingLineUpdateFields,
  asDispenserSpendingLines,
} from './dispenserSpendingLine';

// Associations
Dispenser.hasMany(DispenserSpendingLine, { as: asDispenserSpendingLines });

export { Dispenser, DispenserSpendingLine, IDispenserSpendingLineUpdateFields, asDispenserSpendingLines };
