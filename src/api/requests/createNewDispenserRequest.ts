import IRequest from './iRequest';
import { BadRequestApiError, RequiredBodyFieldApiError } from '../../errors';

interface IJsonCreateNewDispenserRequest {
  readonly flow_volume: number;
}

class CreateNewDispenserRequest implements IRequest {
  public readonly flowVolume!: number;

  constructor({ flow_volume }: IJsonCreateNewDispenserRequest) {
    this.flowVolume = flow_volume;
    this.validate();
  }

  validate(): void {
    if (this.flowVolume == null) {
      throw new RequiredBodyFieldApiError('flow_volume');
    } else if (this.flowVolume <= 0) {
      throw new BadRequestApiError("'flow_volume' should be higher than '0'");
    }
  }
}

export default CreateNewDispenserRequest;
