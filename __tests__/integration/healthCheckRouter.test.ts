import app from '../../src/app';
import request from 'supertest';

import { HttpStatus } from '../../src/enums';

const v1BaseRoute = '/v1/health-check';

describe('Health Check Router', () => {
  describe('V1', () => {
    test('GET /ping', async () => {
      const { statusCode, body } = await request(app.listen())
        .get(v1BaseRoute + '/ping')
        .send();

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.message).toBe('pong!');
    });
  });
});
