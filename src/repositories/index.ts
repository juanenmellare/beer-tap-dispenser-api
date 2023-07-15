import DispenserRepository, { IDispenserRepository } from './dispenserRepository';

const dispenserRepository: IDispenserRepository = new DispenserRepository();

const repositories: {
  dispenserRepository: IDispenserRepository;
} = {
  dispenserRepository,
};

export { IDispenserRepository };
export default repositories;
