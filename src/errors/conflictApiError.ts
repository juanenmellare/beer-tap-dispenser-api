import ApiError from './apiError';
import { HttpStatus } from '../enums';

class ConflictApiError extends ApiError {
  constructor(message: string, display = false) {
    super(HttpStatus.CONFLICT, message, display);
  }
}

export default ConflictApiError;
