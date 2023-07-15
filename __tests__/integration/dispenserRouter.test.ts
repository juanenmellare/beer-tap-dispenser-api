import app from '../../src/app';
import request from 'supertest';

import { DispenserStatus, HttpStatus } from '../../src/enums';
import { asDispenserSpendingLines, Dispenser, DispenserSpendingLine } from '../../src/models';
import { randomUUID } from 'crypto';
import { getNowUTC, toUTC } from '../../src/utils/dateUtils';
import moment from 'moment';

const v1BaseRoute = '/v1/dispenser';

describe('Dispenser Router', () => {
  describe('V1', () => {
    describe('POST /', () => {
      test('200 Ok', async () => {
        const dispenserId = randomUUID();
        const flowVolume = 0.064;

        jest.spyOn(Dispenser, 'create').mockResolvedValueOnce({
          id: dispenserId,
          flowVolume,
        });

        const {
          statusCode,
          body: { id, flow_volume },
        } = await request(app).post(v1BaseRoute).send({ flow_volume: 0.064 });

        expect(statusCode).toBe(HttpStatus.OK);
        expect(id).toBe(dispenserId);
        expect(flow_volume).toBe(flowVolume);
      });

      test('500 Internal Server Error', async () => {
        const {
          statusCode,
          body: { description },
        } = await request(app).post(v1BaseRoute).send({});

        expect(statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(description).toBe('Unexpected API error');
      });
    });

    describe('PUT /{id}/status', () => {
      describe('202 Accepted', () => {
        test('status: open | with updated_at field', async () => {
          const dispenserId = randomUUID();
          const flowVolume = 0.0653;
          const openedAt = new Date('2022-01-01T02:00:00Z');
          const dispenser = Dispenser.build({ id: dispenserId, flowVolume });

          const dispenserFindOneSpy = jest.spyOn(Dispenser, 'findOne').mockResolvedValueOnce(dispenser);

          const dispenserSpendingLineFindOneSpy = jest
            .spyOn(DispenserSpendingLine, 'findOne')
            .mockResolvedValueOnce(null);

          const DispenserSpendingLineCreateSpy = jest
            .spyOn(DispenserSpendingLine, 'create')
            .mockResolvedValueOnce({ dispenserId, flowVolume, openedAt });

          const {
            statusCode,
            body: { message },
          } = await request(app)
            .put(`${v1BaseRoute}/${dispenserId}/status`)
            .send({ status: DispenserStatus.OPEN, updated_at: openedAt });

          expect(dispenserFindOneSpy).toHaveBeenCalledWith({ where: { id: dispenserId }, include: [] });
          expect(dispenserSpendingLineFindOneSpy).toHaveBeenCalledWith({
            where: {
              dispenser_id: dispenserId,
              closed_at: null,
            },
          });
          expect(DispenserSpendingLineCreateSpy).toHaveBeenCalledWith({
            dispenserId,
            flowVolume,
            openedAt: toUTC(openedAt),
          });
          expect(statusCode).toBe(HttpStatus.ACCEPTED);
          expect(message).toBe('Status of the tap changed correctly');
        });

        test('status: close | with updated_at field', async () => {
          const dispenserId = randomUUID();
          const flowVolume = 0.064;
          const dispenser = Dispenser.build({ id: dispenserId, flowVolume });

          const dispenserFindOneSpy = jest.spyOn(Dispenser, 'findOne').mockResolvedValueOnce(dispenser);

          const openedAt = new Date('2022-01-01T02:00:00Z');
          const dispenserSpendingLineId = randomUUID();
          const dispenserSpendingLine = DispenserSpendingLine.build({
            id: dispenserSpendingLineId,
            dispenserId,
            flowVolume,
            openedAt,
          });
          const dispenserSpendingLineFindOneSpy = jest
            .spyOn(DispenserSpendingLine, 'findOne')
            .mockResolvedValueOnce(dispenserSpendingLine);

          const dispenserSpendingLineUpdateSpy = jest.spyOn(DispenserSpendingLine, 'update').mockResolvedValueOnce([1]);

          const closedAt = new Date('2022-01-01T02:00:50Z');

          const {
            statusCode,
            body: { message },
          } = await request(app)
            .put(`${v1BaseRoute}/${dispenserId}/status`)
            .send({ status: DispenserStatus.CLOSE, updated_at: closedAt });

          expect(dispenserFindOneSpy).toHaveBeenCalledWith({ where: { id: dispenserId }, include: [] });
          expect(dispenserSpendingLineFindOneSpy).toHaveBeenCalledWith({
            where: {
              dispenser_id: dispenserId,
              closed_at: null,
            },
          });
          expect(dispenserSpendingLineUpdateSpy).toHaveBeenCalledWith(
            { closedAt, totalSpent: 39.2 },
            { where: { id: dispenserSpendingLineId } },
          );
          expect(statusCode).toBe(HttpStatus.ACCEPTED);
          expect(message).toBe('Status of the tap changed correctly');
        });
      });

      describe('409 Conflict', () => {
        test('status: open', async () => {
          const dispenserId = randomUUID();
          const flowVolume = 0.064;
          const dispenser = Dispenser.build({ id: dispenserId, flowVolume });

          const dispenserFindOneSpy = jest.spyOn(Dispenser, 'findOne').mockResolvedValueOnce(dispenser);

          const dispenserSpendingLine = DispenserSpendingLine.build();
          const dispenserSpendingLineFindOneSpy = jest
            .spyOn(DispenserSpendingLine, 'findOne')
            .mockResolvedValueOnce(dispenserSpendingLine);

          const {
            statusCode,
            body: { description },
          } = await request(app).put(`${v1BaseRoute}/${dispenserId}/status`).send({ status: DispenserStatus.OPEN });

          expect(dispenserFindOneSpy).toHaveBeenCalledWith({ where: { id: dispenserId }, include: [] });
          expect(dispenserSpendingLineFindOneSpy).toHaveBeenCalledWith({
            where: {
              dispenser_id: dispenserId,
              closed_at: null,
            },
          });

          expect(statusCode).toBe(HttpStatus.CONFLICT);
          expect(description).toBe('Dispenser is already opened/closed');
        });

        test('status: close', async () => {
          const dispenserId = randomUUID();
          const flowVolume = 0.064;
          const dispenser = Dispenser.build({ id: dispenserId, flowVolume });

          const dispenserFindOneSpy = jest.spyOn(Dispenser, 'findOne').mockResolvedValueOnce(dispenser);

          const dispenserSpendingLineFindOneSpy = jest
            .spyOn(DispenserSpendingLine, 'findOne')
            .mockResolvedValueOnce(null);

          const {
            statusCode,
            body: { description },
          } = await request(app).put(`${v1BaseRoute}/${dispenserId}/status`).send({ status: DispenserStatus.CLOSE });

          expect(dispenserFindOneSpy).toHaveBeenCalledWith({ where: { id: dispenserId }, include: [] });
          expect(dispenserSpendingLineFindOneSpy).toHaveBeenCalledWith({
            where: {
              dispenser_id: dispenserId,
              closed_at: null,
            },
          });
          expect(statusCode).toBe(HttpStatus.CONFLICT);
          expect(description).toBe('Dispenser is already opened/closed');
        });
      });

      test('500 Internal Server Error', async () => {
        const dispenserId = randomUUID();

        const {
          statusCode,
          body: { description },
        } = await request(app).put(`${v1BaseRoute}/${dispenserId}/status`).send({});

        expect(statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(description).toBe('Unexpected API error');
      });
    });

    describe('GET /{id}/spending', () => {
      describe('200 Ok', () => {
        test('with spending dispenser lines', async () => {
          const dispenserId = randomUUID();
          const flowVolume = 0.064;
          const dispenser = Dispenser.build({ id: dispenserId, flowVolume });

          const dispenserFindOneSpy = jest.spyOn(Dispenser, 'findOne').mockResolvedValueOnce(dispenser);

          const {
            statusCode,
            body: { amount, usages },
          } = await request(app).get(`${v1BaseRoute}/${dispenserId}/spending`).send({});

          expect(dispenserFindOneSpy).toHaveBeenCalledWith({
            where: { id: dispenserId },
            include: [{ model: DispenserSpendingLine, as: asDispenserSpendingLines }],
          });
          expect(statusCode).toBe(HttpStatus.OK);
          expect(amount).toBe(0);
          expect(usages).toHaveLength(0);
        });

        test('without spending dispenser lines', async () => {
          const dispenserId = randomUUID();

          const flowVolume = 0.064;
          const openedAt = moment(new Date()).add(-5, 'seconds');
          const closedAt = getNowUTC();
          const dispenserSpendingLineOne = DispenserSpendingLine.build({
            dispenserId,
            flowVolume,
            openedAt,
            closedAt,
            totalSpent: 5,
          });
          const dispenserSpendingLineTwo = DispenserSpendingLine.build({
            dispenserId,
            flowVolume,
            openedAt,
          });
          const dispenser = Dispenser.build({ id: dispenserId, flowVolume });
          Object.defineProperty(dispenser, 'dispenserSpendingLines', {
            get: jest.fn().mockReturnValue([dispenserSpendingLineOne, dispenserSpendingLineTwo]),
          });
          const dispenserFindOneSpy = jest.spyOn(Dispenser, 'findOne').mockResolvedValueOnce(dispenser);

          const {
            statusCode,
            body: { amount, usages },
          } = await request(app).get(`${v1BaseRoute}/${dispenserId}/spending`).send({});

          expect(dispenserFindOneSpy).toHaveBeenCalledWith({
            where: { id: dispenserId },
            include: [{ model: DispenserSpendingLine, as: asDispenserSpendingLines }],
          });
          expect(statusCode).toBe(HttpStatus.OK);
          expect(amount).toBe(8.92);
          expect(usages).toHaveLength(2);
          expect(usages[0].flow_volume).toBe(flowVolume);
          expect(usages[0].opened_at).toBe(openedAt.toISOString());
          expect(usages[0].closed_at).toBe(closedAt.toISOString());
          expect(usages[0].total_spent).toBe(5);
          expect(usages[1].flow_volume).toBe(flowVolume);
          expect(usages[1].opened_at).toBe(openedAt.toISOString());
          expect(usages[1].closed_at).toBeNull();
          expect(usages[1].total_spent).toBe(3.92);
        });
      });

      test('404 Not Found', async () => {
        const dispenserId = randomUUID();

        const dispenserFindOneSpy = jest.spyOn(Dispenser, 'findOne').mockResolvedValueOnce(null);

        const {
          statusCode,
          body: { description },
        } = await request(app).get(`${v1BaseRoute}/${dispenserId}/spending`).send({});

        expect(dispenserFindOneSpy).toHaveBeenCalledWith({
          where: { id: dispenserId },
          include: [{ model: DispenserSpendingLine, as: asDispenserSpendingLines }],
        });
        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(description).toBe('Requested dispenser does not exist');
      });

      test('500 Internal Server Error', async () => {
        const dispenserId = randomUUID();

        const dispenserFindOneSpy = jest.spyOn(Dispenser, 'findOne').mockRejectedValueOnce(new Error());

        const {
          statusCode,
          body: { description },
        } = await request(app).get(`${v1BaseRoute}/${dispenserId}/spending`).send({});

        expect(dispenserFindOneSpy).toHaveBeenCalledWith({
          where: { id: dispenserId },
          include: [{ model: DispenserSpendingLine, as: asDispenserSpendingLines }],
        });
        expect(statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(description).toBe('Unexpected API error');
      });
    });
  });
});
