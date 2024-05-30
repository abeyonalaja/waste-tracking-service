import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { Lifecycle, ReqRefDefaults, server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import {
  BatchRef,
  BulkSubmissionBackend,
  Input,
} from './bulk-submission.backend';
import bulkSubmissionPlugin from './bulk-submission.plugin';
import { BulkSubmission } from '@wts/api/waste-tracking-gateway';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const accountId = '964cc80b-da90-4675-ac05-d4d1d79ac888';

const mockBackend = {
  createBatch:
    jest.fn<(accountId: string, inputs: Input[]) => Promise<{ id: string }>>(),
  getBatch: jest.fn<(ref: BatchRef) => Promise<BulkSubmission>>(),
  finalizeBatch: jest.fn<(ref: BatchRef) => Promise<void>>(),
};

const app = server({
  host: 'localhost',
  port: 3002,
});

beforeAll(async () => {
  await app.register({
    plugin: bulkSubmissionPlugin,
    options: {
      backend: mockBackend as unknown as BulkSubmissionBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/batches',
    },
  });

  app.auth.scheme('mock', function () {
    return {
      authenticate: async function (
        _,
        h,
      ): Promise<Lifecycle.ReturnValueTypes<ReqRefDefaults>> {
        return h.authenticated({ credentials: { accountId } });
      },
    };
  });

  app.auth.strategy('mock', 'mock');
  app.auth.default('mock');

  await app.start();
});

afterAll(async () => {
  await app.stop();
});

describe('BulkSubmissionPlugin', () => {
  beforeEach(() => {
    mockBackend.createBatch.mockClear();
    mockBackend.getBatch.mockClear();
    mockBackend.finalizeBatch.mockClear();
  });

  describe('POST /batches', () => {
    it('Responds 415 with no request payload', async () => {
      const options = {
        method: 'POST',
        url: '/batches',
      };

      const response = await app.inject(options);
      expect(response.statusCode).toBe(415);
    });
  });

  describe('GET /batches/{id}', () => {
    it("Responds 404 if bulk submission doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/batches/${faker.datatype.uuid()}`,
      };

      mockBackend.getBatch.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /batches/{id}/finalize', () => {
    it('Responds 201 with no request payload', async () => {
      const options = {
        method: 'POST',
        url: `/batches/${faker.datatype.uuid()}/finalize`,
      };

      const response = await app.inject(options);
      expect(response.statusCode).toBe(201);
    });
  });
});
