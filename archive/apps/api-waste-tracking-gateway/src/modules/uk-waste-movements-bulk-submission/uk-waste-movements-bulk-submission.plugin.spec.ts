import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { ServerInjectOptions, server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import {
  BatchRef,
  ServiceUkWasteMovementsBulkSubmissionBackend,
  Input,
  DownloadRef,
  RowRef,
  ColumnRef,
  SubmissionRef,
} from './uk-waste-movements-bulk-submission.backend';
import ukwmBulkSubmissionPlugin from './uk-waste-movements-bulk-submission.plugin';
import {
  BulkSubmission,
  UkwmColumnWithMessage,
  UkwmRowWithMessage,
  UkwmPagedSubmissionData,
} from '@wts/api/waste-tracking-gateway';

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
  downloadCsv: jest.fn<(ref: DownloadRef) => Promise<string | Buffer>>(),
  getRow: jest.fn<(ref: RowRef) => Promise<UkwmRowWithMessage>>(),
  getColumn: jest.fn<(ref: ColumnRef) => Promise<UkwmColumnWithMessage>>(),
  getSubmissions:
    jest.fn<(ref: SubmissionRef) => Promise<UkwmPagedSubmissionData>>(),
};

const app = server({
  host: 'localhost',
  port: 3007,
});

beforeAll(async () => {
  await app.register({
    plugin: ukwmBulkSubmissionPlugin,
    options: {
      backend:
        mockBackend as unknown as ServiceUkWasteMovementsBulkSubmissionBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/ukwm-batches',
    },
  });

  app.auth.scheme('mock', function () {
    return {
      authenticate: async function (_, h): Promise<unknown> {
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

describe('UkWasteMovementsBulkSubmissionPlugin', () => {
  beforeEach(() => {
    mockBackend.createBatch.mockClear();
    mockBackend.getBatch.mockClear();
    mockBackend.finalizeBatch.mockClear();
    mockBackend.downloadCsv.mockClear();
  });

  describe('POST /ukwm-batches', () => {
    it('Responds 415 with no request payload', async () => {
      const options = {
        method: 'POST',
        url: '/ukwm-batches',
      };

      const response = await app.inject(options);
      expect(response.statusCode).toBe(415);
    });
  });

  describe('GET /ukwm-batches/{id}', () => {
    it("Responds 404 if bulk submission doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/ukwm-batches/${faker.string.uuid()}`,
      };

      mockBackend.getBatch.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST/ukwm-batches /{id}/finalize', () => {
    it('Responds 201 with no request payload', async () => {
      const options = {
        method: 'POST',
        url: `/ukwm-batches/${faker.string.uuid()}/finalize`,
      };

      const response = await app.inject(options);
      expect(response.statusCode).toBe(201);
    });
  });

  describe('GET /ukwm-batches/{id}/download', () => {
    it("Responds 404 if bulk submission doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/ukwm-batches/${faker.string.uuid()}/download`,
      };

      mockBackend.downloadCsv.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /ukwm-batches/{batchId}/rows/{rowId}', () => {
    it("Responds 404 if row doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/ukwm-batches/${faker.string.uuid()}/rows/${faker.string.uuid()}`,
      };

      mockBackend.getRow.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /ukwm-batches/{batchId}/columns/{columnRef}', () => {
    it("Responds 404 if column doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/ukwm-batches/${faker.string.uuid()}/columns/testCol`,
      };

      mockBackend.getColumn.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /ukwm-batches/{batchId}/submissions', () => {
    it("Responds 404 if batch doesn't exist", async () => {
      const options: ServerInjectOptions = {
        method: 'GET',
        url: `/ukwm-batches/${faker.string.uuid()}/submissions?page=1`,
      };

      mockBackend.getSubmissions.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });
});
