import { Dispenser } from '../../models';

class CreateNewDispenserResponse {
  public readonly id!: string;
  public readonly flow_volume!: number;

  constructor({ id, flowVolume }: Dispenser) {
    this.id = id;
    this.flow_volume = flowVolume;
  }
}

export default CreateNewDispenserResponse;
