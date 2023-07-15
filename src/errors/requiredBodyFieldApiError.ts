import BadRequestApiError from './badRequestApiError';

class RequiredBodyFieldApiError extends BadRequestApiError {
  constructor(field: string) {
    super(`field '${field}' is required`);
  }
}

export default RequiredBodyFieldApiError;
