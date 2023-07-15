import { DispenserSpendingLine } from '../models';

class DispenserSpendingLineShouldBeOpenedAndClosedError extends Error {
  constructor({ dispenserId }: DispenserSpendingLine) {
    super(`Dispenser spending line from '${dispenserId}' should be already opened and closed`);
  }
}

export default DispenserSpendingLineShouldBeOpenedAndClosedError;
