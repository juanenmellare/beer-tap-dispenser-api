import NotFoundApiError from './notFoundApiError';

class RequestedDispenserNotFound extends NotFoundApiError {
  constructor(display = false) {
    super('Requested dispenser does not exist', display);
  }
}

export default RequestedDispenserNotFound;
