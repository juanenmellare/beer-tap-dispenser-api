import express, { NextFunction, Request, Response, Router as ExpressRouter } from 'express';
import { asyncHandler } from './middlewares';
import { CreateNewDispenserRequest, UpdateDispenserStatusRequest } from './requests';
import { CreateNewDispenserResponse, GetDispenserSpendingResponse, UpdateDispenserStatusResponse } from './responses';
import { ConflictApiError, DispenserStatusError, RequestedDispenserNotFound } from '../errors';
import { Dispenser } from '../models';
import { HttpStatus } from '../enums';
import { getNowUTC } from '../utils/dateUtils';

import { dispenserService } from '../services';

const dispenserRouter: ExpressRouter = express.Router();

dispenserRouter.post(
  '/',
  asyncHandler(async (request: Request, response: Response) => {
    const { body } = request;
    const { flowVolume } = new CreateNewDispenserRequest(body);

    const dispenser: Dispenser = await dispenserService.create(flowVolume);

    const createNewDispenserResponse: CreateNewDispenserResponse = new CreateNewDispenserResponse(dispenser);
    response.json(createNewDispenserResponse);
  }),
);

dispenserRouter.put(
  '/:id/status',
  asyncHandler(async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const {
      body,
      params: { id },
    } = request;
    const { status, updatedAt } = new UpdateDispenserStatusRequest(body);
    const finalUpdatedAt = updatedAt || getNowUTC();

    const dispenser: Dispenser | null = await dispenserService.findById(id, false);
    if (!dispenser) {
      throw new RequestedDispenserNotFound();
    }

    try {
      await dispenserService.updateStatusSpendingLine(dispenser, status, finalUpdatedAt);
    } catch (error) {
      if (error instanceof DispenserStatusError) {
        error = new ConflictApiError(error.message, true);
      }
      next(error);
      return;
    }

    const updateDispenserStatusResponse = new UpdateDispenserStatusResponse();
    response.status(HttpStatus.ACCEPTED).json(updateDispenserStatusResponse);
  }),
);

dispenserRouter.get(
  '/:id/spending',
  asyncHandler(async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const {
      params: { id },
    } = request;
    const closetAtCandidate = getNowUTC();
    const dispenser: Dispenser | null = await dispenserService.findById(id, true);
    if (!dispenser) {
      const error = new RequestedDispenserNotFound(true);
      next(error);
      return;
    }
    const spentAmount: number = await dispenserService.calculateASpendingLinesAmountSpent(dispenser, closetAtCandidate);

    const getDispenserSpendingResponse = new GetDispenserSpendingResponse(
      spentAmount,
      dispenser.dispenserSpendingLines,
    );
    response.json(getDispenserSpendingResponse);
  }),
);

export default dispenserRouter;
