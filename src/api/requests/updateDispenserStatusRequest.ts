import IRequest from './iRequest';
import { RequiredBodyFieldApiError } from '../../errors';
import { DispenserStatus } from '../../enums';
import { toUTC } from '../../utils/dateUtils';

interface IJsonUpdateDispenseStatusRequest {
  readonly status: DispenserStatus;
  readonly updated_at?: Date | null;
}

class UpdateDispenseStatusRequest implements IRequest {
  public readonly status!: DispenserStatus;
  public readonly updatedAt?: Date | null;

  constructor({ status, updated_at }: IJsonUpdateDispenseStatusRequest) {
    this.status = status?.toLowerCase() as DispenserStatus;
    this.validate();
    this.updatedAt = !!updated_at ? toUTC(updated_at) : null;
  }

  validate(): void {
    if (this.status == null) {
      throw new RequiredBodyFieldApiError('status');
    }
  }
}

export default UpdateDispenseStatusRequest;
