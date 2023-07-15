import ApiError from './apiError';
import { HttpStatus } from '../enums';

class BadRequestApiError extends ApiError {
  constructor(message: string, display = false) {
    super(HttpStatus.BAD_REQUEST, message, display);
  }
}

export default BadRequestApiError;
