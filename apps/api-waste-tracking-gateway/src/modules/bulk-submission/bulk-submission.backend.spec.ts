import { DaprAnnexViiBulkClient } from '@wts/client/green-list-waste-export-bulk';
import { AnnexViiBulkServiceBackend } from './bulk-submission.backend';
import { jest, expect } from '@jest/globals';
import { DaprClient } from '@dapr/dapr';
import { faker } from '@faker-js/faker';
import winston from 'winston';
import {
  AddContentToBatchRequest,
  AddContentToBatchResponse,
  GetBatchRequest,
  GetBatchResponse,
  UpdateBatchRequest,
  UpdateBatchResponse,
} from '@wts/api/green-list-waste-export-bulk';
import Boom from '@hapi/boom';
import { compress } from 'snappy';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    info: jest.fn(),
    error: jest.fn(),
  })),
}));

jest.mock('@dapr/dapr', () => ({
  DaprClient: jest.fn().mockImplementation(() => ({
    invoker: {
      invoke: jest.fn<typeof DaprClient.prototype.invoker.invoke>(),
    },
  })),
}));

const mockAddContentToBatch =
  jest.fn<
    (req: AddContentToBatchRequest) => Promise<AddContentToBatchResponse>
  >();
const mockGetBatch =
  jest.fn<(req: GetBatchRequest) => Promise<GetBatchResponse>>();
const mockUpdateBatch =
  jest.fn<(req: UpdateBatchRequest) => Promise<UpdateBatchResponse>>();

jest.mock('@wts/client/green-list-waste-export-bulk', () => ({
  DaprAnnexViiBulkClient: jest.fn().mockImplementation(() => ({
    addContentToBatch: mockAddContentToBatch,
    getBatch: mockGetBatch,
    updateBatch: mockUpdateBatch,
  })),
}));

describe(AnnexViiBulkServiceBackend, () => {
  const subject = new AnnexViiBulkServiceBackend(
    new DaprAnnexViiBulkClient(new DaprClient(), faker.datatype.string()),
    new winston.Logger(),
  );

  beforeEach(() => {
    mockAddContentToBatch.mockClear();
    mockGetBatch.mockClear();
    mockUpdateBatch.mockClear();
  });

  describe('createBatch', () => {
    it('throws client error if no CSV content', async () => {
      const accountId = faker.datatype.uuid();
      const inputs = [
        {
          type: 'application/json',
          data: Buffer.from('{"test":"test"}'),
        },
      ];

      try {
        await subject.createBatch(accountId, inputs);
      } catch (err) {
        expect(err).toEqual(Boom.badRequest("Input type must be 'text/csv'"));
      }
    });

    it('throws client error if empty input', async () => {
      try {
        await subject.createBatch(faker.datatype.uuid(), []);
      } catch (err) {
        expect(err).toEqual(Boom.badRequest());
      }
    });

    it('forwards thrown Boom errors', async () => {
      const accountId = faker.datatype.uuid();
      const inputs = [
        {
          type: 'text/csv',
          data: Buffer.from('test,test'),
        },
      ];
      mockAddContentToBatch.mockResolvedValueOnce({
        success: false,
        error: {
          statusCode: 400,
          name: 'Bad Request',
          message: 'CSV_RECORD_INCONSISTENT_COLUMNS',
        },
      });

      try {
        await subject.createBatch(accountId, inputs);
      } catch (err) {
        expect(err).toEqual(Boom.badRequest('CSV_RECORD_INCONSISTENT_COLUMNS'));
      }
      expect(mockAddContentToBatch).toBeCalledWith({
        accountId,
        batchId: undefined,
        content: {
          type: 'text/csv',
          compression: 'Snappy',
          value: (await compress(Buffer.from('test,test'))).toString('base64'),
        },
      });
    });

    it('throws server error if response cannot be returned via Dapr', async () => {
      const accountId = faker.datatype.uuid();
      const inputs = [
        {
          type: 'text/csv',
          data: Buffer.from('test,test'),
        },
      ];
      mockAddContentToBatch.mockRejectedValueOnce(new Error('Mock error'));

      try {
        await subject.createBatch(accountId, inputs);
      } catch (err) {
        expect(err).toEqual(Boom.internal());
      }
      expect(mockAddContentToBatch).toBeCalledWith({
        accountId,
        batchId: undefined,
        content: {
          type: 'text/csv',
          compression: 'Snappy',
          value: (await compress(Buffer.from('test,test'))).toString('base64'),
        },
      });
    });

    it('returns successful response', async () => {
      const accountId = faker.datatype.uuid();
      const inputs = [
        {
          type: 'text/csv',
          data: Buffer.from('test,test'),
        },
      ];
      const batchId = faker.datatype.uuid();
      mockAddContentToBatch.mockResolvedValueOnce({
        success: true,
        value: {
          batchId,
        },
      });

      expect(await subject.createBatch(accountId, inputs)).toEqual({
        id: batchId,
      });
      expect(mockAddContentToBatch).toBeCalledWith({
        accountId,
        batchId: undefined,
        content: {
          type: 'text/csv',
          compression: 'Snappy',
          value: (await compress(Buffer.from('test,test'))).toString('base64'),
        },
      });
    });
  });

  describe('getBatch', () => {
    it('throws client error if unsuccessful response was returned via Dapr', async () => {
      const request = {
        id: faker.datatype.uuid(),
        accountId: faker.datatype.uuid(),
      };
      mockGetBatch.mockResolvedValueOnce({
        success: false,
        error: {
          statusCode: 404,
          name: 'Test',
          message: 'Not Found',
        },
      });

      try {
        await subject.getBatch(request);
      } catch (err) {
        expect(err).toEqual(Boom.notFound());
      }
      expect(mockGetBatch).toBeCalledWith(request);
    });

    it('throws server error if response cannot be returned via Dapr', async () => {
      const request = {
        id: faker.datatype.uuid(),
        accountId: faker.datatype.uuid(),
      };
      mockGetBatch.mockRejectedValueOnce(Boom.teapot());

      try {
        await subject.getBatch(request);
      } catch (err) {
        expect(err).toEqual(Boom.internal());
      }
      expect(mockGetBatch).toBeCalledWith(request);
    });

    it('returns successful response', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      const request = { id: id, accountId: faker.datatype.uuid() };
      mockGetBatch.mockResolvedValueOnce({
        success: true,
        value: {
          id: id,
          state: {
            status: 'Processing',
            timestamp: timestamp,
          },
        },
      });

      expect(await subject.getBatch(request)).toEqual({
        id: id,
        state: {
          status: 'Processing',
          timestamp: timestamp,
        },
      });
      expect(mockGetBatch).toBeCalledWith(request);
    });
  });

  describe('finalizeBatch', () => {
    it('throws client error if unsuccessful response was returned via Dapr', async () => {
      const request = {
        id: faker.datatype.uuid(),
        accountId: faker.datatype.uuid(),
      };
      mockUpdateBatch.mockResolvedValueOnce({
        success: false,
        error: {
          statusCode: 400,
          name: 'Test',
          message: 'Bad Request',
        },
      });

      try {
        await subject.finalizeBatch(request);
      } catch (err) {
        expect(err).toEqual(Boom.badRequest());
      }
      expect(mockUpdateBatch).toBeCalledWith(request);
    });

    it('throws server error if response cannot be returned via Dapr', async () => {
      const request = {
        id: faker.datatype.uuid(),
        accountId: faker.datatype.uuid(),
      };
      mockUpdateBatch.mockRejectedValueOnce(Boom.teapot());

      try {
        await subject.finalizeBatch(request);
      } catch (err) {
        expect(err).toEqual(Boom.internal());
      }
      expect(mockUpdateBatch).toBeCalledWith(request);
    });

    it('returns successful response', async () => {
      const request = {
        id: faker.datatype.uuid(),
        accountId: faker.datatype.uuid(),
      };
      mockUpdateBatch.mockResolvedValueOnce({
        success: true,
        value: undefined,
      });

      expect(await subject.finalizeBatch(request)).toEqual(undefined);
      expect(mockUpdateBatch).toBeCalledWith(request);
    });
  });
});
