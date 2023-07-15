import {
  asDispenserSpendingLines,
  Dispenser,
  DispenserSpendingLine,
  IDispenserSpendingLineUpdateFields,
} from '../models';

export interface IDispenserRepository {
  findById(id: string, hasToIncludeModels: boolean): Promise<Dispenser | null>;
  create(flowVolume: number): Promise<Dispenser>;
  createSpendingLine(dispenser: Dispenser, openedAt: Date): Promise<DispenserSpendingLine>;
  updateSpendingLine(spendingLine: DispenserSpendingLine, fields: IDispenserSpendingLineUpdateFields): Promise<void>;
  findSpendingLineOpenedAndNotClosed(dispenserId: string): Promise<DispenserSpendingLine | null>;
}

class DispenserRepository implements IDispenserRepository {
  public async findById(id: string, hasToIncludeModels: boolean): Promise<Dispenser | null> {
    const include = [];
    if (hasToIncludeModels) {
      include.push({ model: DispenserSpendingLine, as: asDispenserSpendingLines });
    }
    return await Dispenser.findOne({
      where: { id },
      include,
    });
  }

  public async create(flowVolume: number): Promise<Dispenser> {
    return await Dispenser.create({
      flowVolume,
    });
  }

  public async createSpendingLine(dispenser: Dispenser, openedAt: Date): Promise<DispenserSpendingLine> {
    const { id, flowVolume } = dispenser;
    return DispenserSpendingLine.create({
      dispenserId: id,
      flowVolume,
      openedAt,
    });
  }

  public async updateSpendingLine(
    spendingLine: DispenserSpendingLine,
    fields: IDispenserSpendingLineUpdateFields,
  ): Promise<void> {
    await DispenserSpendingLine.update(fields, { where: { id: spendingLine.id } });
  }

  public async findSpendingLineOpenedAndNotClosed(dispenserId: string): Promise<DispenserSpendingLine | null> {
    return DispenserSpendingLine.findOne({
      where: {
        dispenser_id: dispenserId,
        closed_at: null,
      },
    });
  }
}

export default DispenserRepository;
