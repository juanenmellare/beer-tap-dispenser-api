import RouterAdapter from './routerAdapter';

import healthCheckRouter from './healthCheckRouter';
import dispenserRouter from './dispenserRouter';

const routers: RouterAdapter[] = [
  new RouterAdapter(1, 'health-check', healthCheckRouter),
  new RouterAdapter(1, 'dispenser', dispenserRouter),
];

export default routers;
