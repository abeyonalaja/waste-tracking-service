import { DaprUkWasteMovementsBulkClient } from '@wts/client/uk-waste-movements-bulk';
import { ServiceUkWasteMovementsBulkSubmissionBackend } from './uk-waste-movements-bulk-submission.backend';
import { jest, expect } from '@jest/globals';
import { DaprClient } from '@dapr/dapr';
import { faker } from '@faker-js/faker';
import winston from 'winston';
import {
  AddContentToBatchRequest,
  AddContentToBatchResponse,
  GetBatchRequest,
  GetBatchResponse,
  FinalizeBatchRequest,
  FinalizeBatchResponse,
  DownloadBatchRequest,
  DownloadBatchResponse,
} from '@wts/api/uk-waste-movements-bulk';
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
const mockFinalizeBatch =
  jest.fn<(req: FinalizeBatchRequest) => Promise<FinalizeBatchResponse>>();
const mockDownloadProducerCsv =
  jest.fn<(req: DownloadBatchRequest) => Promise<DownloadBatchResponse>>();

jest.mock('@wts/client/uk-waste-movements-bulk', () => ({
  DaprUkWasteMovementsBulkClient: jest.fn().mockImplementation(() => ({
    addContentToBatch: mockAddContentToBatch,
    getBatch: mockGetBatch,
    finalizeBatch: mockFinalizeBatch,
    downloadProducerCsv: mockDownloadProducerCsv,
  })),
}));

describe(ServiceUkWasteMovementsBulkSubmissionBackend, () => {
  const subject = new ServiceUkWasteMovementsBulkSubmissionBackend(
    new DaprUkWasteMovementsBulkClient(
      new DaprClient(),
      faker.datatype.string()
    ),
    new winston.Logger()
  );

  beforeEach(() => {
    mockAddContentToBatch.mockClear();
    mockGetBatch.mockClear();
    mockFinalizeBatch.mockClear();
    mockDownloadProducerCsv.mockClear();
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

  describe('downloadCsv', () => {
    it('throws client error if unsuccessful response was returned via Dapr', async () => {
      const request = {
        id: faker.datatype.uuid(),
      };
      mockDownloadProducerCsv.mockResolvedValueOnce({
        success: false,
        error: {
          statusCode: 404,
          name: 'Test',
          message: 'Not Found',
        },
      });

      try {
        await subject.downloadCsv(request);
      } catch (err) {
        expect(err).toEqual(Boom.notFound());
      }
      expect(mockDownloadProducerCsv).toBeCalledWith(request);
    });

    it('throws server error if response cannot be returned via Dapr', async () => {
      const request = {
        id: faker.datatype.uuid(),
      };
      mockDownloadProducerCsv.mockRejectedValueOnce(Boom.teapot());

      try {
        await subject.downloadCsv(request);
      } catch (err) {
        expect(err).toEqual(Boom.internal());
      }
      expect(mockDownloadProducerCsv).toBeCalledWith(request);
    });

    it('returns successful response', async () => {
      const id = faker.datatype.uuid();
      const request = { id: id };

      const expectedData = 'This,is,array,of,submissions';
      const buffer = Buffer.from(expectedData, 'utf-8');
      const compressedBuffer = await compress(buffer);
      const base64Data = compressedBuffer.toString('base64');

      mockDownloadProducerCsv.mockResolvedValueOnce({
        success: true,
        value: {
          data: base64Data,
        },
      });

      const result = await subject.downloadCsv(request);
      expect(result.toString()).toEqual(expectedData);
      expect(mockDownloadProducerCsv).toBeCalledWith(request);
    });
  });
});
