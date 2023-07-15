import repositories from '../repositories';
import DispenserService, { IDispenserService } from './dispenserService';

const { dispenserRepository } = repositories;

const dispenserService: IDispenserService = new DispenserService(dispenserRepository);

export { dispenserService };
