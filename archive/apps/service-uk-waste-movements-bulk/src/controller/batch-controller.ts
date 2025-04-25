import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { fromBoom, success } from '@wts/util/invocation';
import Boom from '@hapi/boom';
import { BatchRepository } from '../data';
import * as api from '@wts/api/uk-waste-movements-bulk';
import { BulkSubmission, Row } from '../model';
import { compress } from 'snappy';
import { downloadHeaders, downloadSections } from '../lib/csv-content';
import { ErrorCodeData, validation } from '@wts/api/uk-waste-movements';

export type Handler<Request, Response> = (
  request: Request,
) => Promise<Response>;

export class BatchController {
  constructor(
    private repository: BatchRepository,
    private logger: Logger,
  ) {}

  addContentToBatch: Handler<
    api.AddContentToBatchRequest,
    api.AddContentToBatchResponse
  > = async ({ accountId }) => {
    try {
      const bulkSubmission: BulkSubmission = {
        id: uuidv4(),
        state: {
          status: 'Processing',
          timestamp: new Date(),
        },
      };

      await this.repository.saveBatch(bulkSubmission, accountId);
      return success({ batchId: bulkSubmission.id });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getBatch: Handler<api.GetBatchRequest, api.GetBatchResponse> = async ({
    id,
    accountId,
  }) => {
    try {
      const data: BulkSubmission = await this.repository.getBatch(
        id,
        accountId,
      );
      const response: api.GetBatchResponse = success(
        data as unknown as api.BulkSubmission,
      );

      return response;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  finalizeBatch: Handler<api.FinalizeBatchRequest, api.FinalizeBatchResponse> =
    async ({ id, accountId }) => {
      try {
        const submissions = await this.repository.getBatch(id, accountId);

        if (submissions.state.status !== 'PassedValidation') {
          throw Boom.badRequest('Batch has not passed validation');
        }

        const timestamp = new Date();
        const transactionId =
          'WM' +
          timestamp.getFullYear().toString().substring(2) +
          (timestamp.getMonth() + 1).toString().padStart(2, '0') +
          '_' +
          id.substring(0, 8).toUpperCase();

        const bulkSubmission: BulkSubmission = {
          id: id,
          state: {
            status: 'Submitting',
            transactionId,
            timestamp,
            hasEstimates: submissions.state.hasEstimates,
          },
        };
        return success(
          await this.repository.saveBatch(bulkSubmission, accountId),
        );
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  downloadProducerCsv: Handler<
    api.DownloadBatchRequest,
    api.DownloadBatchResponse
  > = async ({ id, accountId }) => {
    try {
      const result = await this.repository.downloadProducerCsv(id, accountId);

      let csvText = downloadSections + '\n' + downloadHeaders + '\n';
      for (const submission of result) {
        const keys = Object.keys(submission);
        const values = keys.map((key) => {
          if (submission[key].includes(',')) {
            return `"${submission[key]}"`;
          }
          return submission[key];
        });
        csvText += values.join(',') + '\n';
      }

      const buffer = Buffer.from(csvText, 'utf-8');

      const compressedBuffer = await compress(buffer);

      const base64Data = compressedBuffer.toString('base64');

      return success({ data: base64Data });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getRow: Handler<api.GetRowRequest, api.GetRowResponse> = async ({
    accountId,
    batchId,
    rowId,
  }) => {
    try {
      const row: Row = await this.repository.getRow(accountId, batchId, rowId);

      const rowWithMessage: api.RowWithMessage = {
        accountId: row.accountId,
        batchId: row.batchId,
        id: row.id,
        messages: [],
      };

      if (!row.data.valid) {
        for (const errorCode of row.data.codes) {
          let errorData: ErrorCodeData;
          let args: string[] = [];

          if (typeof errorCode === 'number') {
            errorData = validation.UkwmErrorData[errorCode];
          } else {
            args = errorCode.args;
            errorData = validation.UkwmErrorData[errorCode.code];
          }

          if (errorData.type === 'message') {
            rowWithMessage.messages.push(errorData.message);
          } else {
            rowWithMessage.messages.push(errorData.builder(args));
          }
        }
      }

      return success(rowWithMessage);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getColumn: Handler<api.GetColumnRequest, api.GetColumnResponse> = async ({
    accountId,
    batchId,
    columnRef,
  }) => {
    try {
      const column = await this.repository.getColumn(
        accountId,
        batchId,
        columnRef,
      );
      const columnWithMessage: api.ColumnWithMessage = {
        columnRef: column.id,
        accountId: column.accountId,
        batchId: column.batchId,
        errors: [],
      };

      for (const error of column.errors) {
        const messages = error.codes.map((errorCode) => {
          let errorData: ErrorCodeData;
          let args: string[] = [];

          if (typeof errorCode === 'number') {
            errorData = validation.UkwmErrorData[errorCode];
          } else {
            args = errorCode.args;
            errorData = validation.UkwmErrorData[errorCode.code];
          }

          if (errorData.type === 'message') {
            return errorData.message;
          } else {
            return errorData.builder(args);
          }
        });

        columnWithMessage.errors.push({
          messages,
          rowNumber: error.rowNumber,
        });
      }

      return success(columnWithMessage);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getBulkSubmissions: Handler<
    api.GetBulkSubmissionsRequest,
    api.GetBulkSubmissionsResponse
  > = async ({
    accountId,
    batchId,
    page,
    collectionDate,
    ewcCode,
    pageSize,
    producerName,
    wasteMovementId,
  }) => {
    try {
      const submissions = await this.repository.getBulkSubmissions(
        batchId,
        accountId,
        page,
        pageSize || 16,
        collectionDate,
        ewcCode,
        producerName,
        wasteMovementId,
      );

      return success(submissions);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
