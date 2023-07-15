import { DispenserSpendingLine } from '../../models';

interface IUsage {
  readonly opened_at?: Date;
  readonly closed_at: Date | null;
  readonly flow_volume: number | null;
  readonly total_spent?: number;
}

class GetDispenserSpendingResponse {
  public readonly amount!: number;
  public readonly usages!: IUsage[];

  constructor(amountSpent: number, dispenserSpendingLines: DispenserSpendingLine[] = []) {
    this.amount = amountSpent;
    this.usages = dispenserSpendingLines.map(
      ({ openedAt, closedAt, flowVolume, totalSpent }): IUsage => ({
        opened_at: openedAt,
        closed_at: closedAt || null,
        flow_volume: flowVolume,
        total_spent: totalSpent,
      }),
    );
  }
}

export default GetDispenserSpendingResponse;
