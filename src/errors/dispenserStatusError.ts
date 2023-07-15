class DispenserStatusError extends Error {
  constructor() {
    super('Dispenser is already opened/closed');
  }
}

export default DispenserStatusError;
