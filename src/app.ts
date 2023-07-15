import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routers from './api';
import { errorHandler } from './api/middlewares';

const app: Express = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

routers.forEach(({ prefix, router }) => app.use(prefix, router));

app.use(errorHandler);

export default app;
