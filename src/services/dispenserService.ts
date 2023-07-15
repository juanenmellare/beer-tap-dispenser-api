import { IDispenserRepository } from '../repositories';
import { Dispenser, DispenserSpendingLine } from '../models';
import { DispenserStatus } from '../enums';
import { DispenserSpendingLineShouldBeOpenedAndClosedError, DispenserStatusError } from '../errors';
import { calculateDifferenceInMilliseconds, calculateSecondsFromMilliseconds } from '../utils/dateUtils';
import { beerEurosPerLiter, totalSpentDecimals } from '../configs';

export interface IDispenserService {
  findById(id: string, hasToIncludeModels: boolean): Promise<Dispenser | null>;
  create(flowVolume: number): Promise<Dispenser>;
  updateStatusSpendingLine(dispenser: Dispenser, status: DispenserStatus, updateAt: Date): Promise<void>;
  calculateASpendingLinesAmountSpent(dispenser: Dispenser, closetAtCandidate: Date): Promise<number>;
}

class DispenserService implements IDispenserService {
  private readonly _dispenserRepository: IDispenserRepository;

  constructor(dispenserRepository: IDispenserRepository) {
    this._dispenserRepository = dispenserRepository;
  }

  public async create(flowVolume: number): Promise<Dispenser> {
    const { create } = this._dispenserRepository;
    return await create(flowVolume);
  }

  public async findById(id: string, hasToIncludeModels = false): Promise<Dispenser | null> {
    const { findById } = this._dispenserRepository;

    return findById(id, hasToIncludeModels);
  }

  private async openSpendingLine(dispenser: Dispenser, openedAt: Date): Promise<void> {
    const { findSpendingLineOpenedAndNotClosed, createSpendingLine } = this._dispenserRepository;

    const dispenserSpendingLine: DispenserSpendingLine | null = await findSpendingLineOpenedAndNotClosed(dispenser.id);
    if (dispenserSpendingLine) {
      throw new DispenserStatusError();
    }

    await createSpendingLine(dispenser, openedAt);
  }

  private calculateTotalSpent = (dispenserSpendingLine: DispenserSpendingLine): number => {
    const { closedAt, openedAt, flowVolume } = dispenserSpendingLine;
    if (!openedAt || !closedAt) {
      throw new DispenserSpendingLineShouldBeOpenedAndClosedError(dispenserSpendingLine);
    }
    const spentMilliseconds: number = calculateDifferenceInMilliseconds(closedAt, openedAt);
    const spentSeconds: number = calculateSecondsFromMilliseconds(spentMilliseconds);
    const totalSpend = spentSeconds * flowVolume * beerEurosPerLiter;

    return Number(totalSpend.toString().match(`^-?\\d+(?:\\.\\d{0,${totalSpentDecimals}})?`));
  };

  private async closeSpendingLine(dispenser: Dispenser, closedAt: Date): Promise<void> {
    const { _dispenserRepository, calculateTotalSpent } = this;
    const { findSpendingLineOpenedAndNotClosed, updateSpendingLine } = _dispenserRepository;

    const dispenserSpendingLine: DispenserSpendingLine | null = await findSpendingLineOpenedAndNotClosed(dispenser.id);
    if (dispenserSpendingLine == null) {
      throw new DispenserStatusError();
    }

    dispenserSpendingLine.closedAt = closedAt;
    const totalSpent = calculateTotalSpent(dispenserSpendingLine);

    await updateSpendingLine(dispenserSpendingLine, { closedAt, totalSpent });
  }

  private dispenserStatusHandleFunctionMap = new Map<
    DispenserStatus,
    (dispenser: Dispenser, updatedAt: Date) => Promise<void>
  >([
    [DispenserStatus.OPEN, this.openSpendingLine],
    [DispenserStatus.CLOSE, this.closeSpendingLine],
  ]);

  public async updateStatusSpendingLine(dispenser: Dispenser, status: DispenserStatus, updatedAt: Date): Promise<void> {
    const { dispenserStatusHandleFunctionMap } = this;
    const dispenserStatusHandleFunction = dispenserStatusHandleFunctionMap.get(status);
    if (!dispenserStatusHandleFunction) {
      throw new Error(`Dispenser status '${status.toString()}' has no handler function`);
    }

    await dispenserStatusHandleFunction.call(this, dispenser, updatedAt);
  }

  public async calculateASpendingLinesAmountSpent(dispenser: Dispenser, closetAtCandidate: Date): Promise<number> {
    const { calculateTotalSpent } = this;

    let spentAmount = 0;
    dispenser.dispenserSpendingLines?.forEach((dispenserSpendingLine: DispenserSpendingLine): void => {
      const { totalSpent } = dispenserSpendingLine;
      let totalSpentCandidate = totalSpent || 0;
      if (!dispenserSpendingLine.closedAt) {
        dispenserSpendingLine.closedAt = closetAtCandidate;
        totalSpentCandidate = calculateTotalSpent(dispenserSpendingLine);
        dispenserSpendingLine.closedAt = undefined;
      }
      dispenserSpendingLine.totalSpent = totalSpentCandidate;
      spentAmount = spentAmount + totalSpentCandidate;
    });

    return spentAmount;
  }
}

export default DispenserService;
