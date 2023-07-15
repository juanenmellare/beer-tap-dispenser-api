import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../errors';
import { HttpStatus } from '../../enums';

const errorHandler = (error: Error, request: Request, response: Response, _: NextFunction): void => {
  let status: number;
  let description: string;
  if (error instanceof ApiError && error.hasToDisplay) {
    status = error.status;
    description = error.message;
  } else {
    console.error(`${error.name}: ${error.message}`);
    status = HttpStatus.INTERNAL_SERVER_ERROR;
    description = 'Unexpected API error';
  }
  response.status(status).json({
    description,
  });
};

export default errorHandler;
