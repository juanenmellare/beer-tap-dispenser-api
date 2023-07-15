import { Router as ExpressRouter } from 'express';

class RouterAdapter {
  private readonly _prefix: string;
  private readonly _router: ExpressRouter;

  get prefix(): string {
    return this._prefix;
  }
  get router(): ExpressRouter {
    return this._router;
  }

  constructor(version: number, prefix: string, router: ExpressRouter) {
    this._prefix = `/v${version.toString()}/${prefix}`;
    this._router = router;
  }
}

export default RouterAdapter;
