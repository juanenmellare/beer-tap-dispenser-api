import ApiError from './apiError';
import { HttpStatus } from '../enums';

class NotFoundApiError extends ApiError {
  constructor(message: string, display = false) {
    super(HttpStatus.NOT_FOUND, message, display);
  }
}

export default NotFoundApiError;
