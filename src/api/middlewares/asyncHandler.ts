import { NextFunction, Request, RequestHandler, Response } from 'express';

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (request: Request, response: Response, next: NextFunction): void => {
    Promise.resolve(fn(request, response, next)).catch(next);
  };

export default asyncHandler;
