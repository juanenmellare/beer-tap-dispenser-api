import express, { Request, Response, Router as ExpressRouter } from 'express';

const healthCheckRouter: ExpressRouter = express.Router();

healthCheckRouter.get('/ping', (request: Request, response: Response): void => {
  response.json({
    message: 'pong!',
  });
});

export default healthCheckRouter;
