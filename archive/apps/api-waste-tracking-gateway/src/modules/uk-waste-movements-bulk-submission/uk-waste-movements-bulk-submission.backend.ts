import Boom from '@hapi/boom';
import { DaprUkWasteMovementsBulkClient } from '@wts/client/uk-waste-movements-bulk';
import { compress, uncompress } from 'snappy';
import { Logger } from 'winston';
import {
  UkwmBulkSubmission,
  UkwmRowWithMessage,
  UkwmColumnWithMessage,
  UkwmPagedSubmissionData,
} from '@wts/api/waste-tracking-gateway';
import * as api from '@wts/api/uk-waste-movements-bulk';

export interface BatchRef {
  id: string;
  accountId: string;
}

export interface DownloadRef {
  id: string;
  accountId: string;
}

export interface Input {
  type: string;
  data: Buffer;
}

export interface RowRef {
  rowId: string;
  batchId: string;
  accountId: string;
}

export interface ColumnRef {
  columnRef: string;
  batchId: string;
  accountId: string;
}

export interface SubmissionRef {
  batchId: string;
  accountId: string;
  page: number;
  pageSize?: number;
  collectionDate?: Date;
  ewcCode?: string;
  producerName?: string;
  wasteMovementId?: string;
}

export interface UkWasteMovementsBulkSubmissionBackend {
  createBatch(accountId: string, inputs: Input[]): Promise<{ id: string }>;
  getBatch(ref: BatchRef): Promise<UkwmBulkSubmission>;
  finalizeBatch(ref: BatchRef): Promise<void>;
  downloadCsv(ref: DownloadRef): Promise<string | Buffer>;
  getRow(ref: RowRef): Promise<UkwmRowWithMessage>;
  getColumn(ref: ColumnRef): Promise<UkwmColumnWithMessage>;
  getSubmissions(ref: SubmissionRef): Promise<UkwmPagedSubmissionData>;
}

export class ServiceUkWasteMovementsBulkSubmissionBackend
  implements UkWasteMovementsBulkSubmissionBackend
{
  constructor(
    private client: DaprUkWasteMovementsBulkClient,
    private logger: Logger,
  ) {}

  async createBatch(
    accountId: string,
    inputs: Input[],
  ): Promise<{ id: string }> {
    try {
      if (inputs.length === 0) {
        throw Boom.badRequest();
      }

      let batchId: string | undefined;
      for (const input of inputs) {
        if (input.type !== 'text/csv') {
          throw Boom.badRequest("Input type must be 'text/csv'");
        }

        const content = (await compress(input.data)).toString('base64');
        const response = await this.client.addContentToBatch({
          accountId,
          batchId,
          content: {
            type: input.type as 'text/csv',
            compression: 'Snappy',
            value: content,
          },
        });

        if (!response.success) {
          this.logger.error('Error response from backend', {
            message: response.error.message,
          });

          throw new Boom.Boom(response.error.message, {
            statusCode: response.error.statusCode,
          });
        }

        this.logger.info('Added content to batch', {
          batchId: response.value.batchId,
          length: content.length,
        });

        batchId = response.value.batchId;
      }

      return { id: batchId as string };
    } catch (err) {
      if (err instanceof Boom.Boom) {
        throw new Boom.Boom(err.message, {
          statusCode: err.output.statusCode,
        });
      }

      this.logger.error('Error handling request', err);
      throw Boom.internal();
    }
  }

  async getBatch({ id, accountId }: BatchRef): Promise<UkwmBulkSubmission> {
    let response: api.GetBatchResponse;
    try {
      response = await this.client.getBatch({ id, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as UkwmBulkSubmission;
  }

  async finalizeBatch({ id, accountId }: BatchRef): Promise<void> {
    let response: api.FinalizeBatchResponse;
    try {
      response = await this.client.finalizeBatch({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async downloadCsv({ id, accountId }: DownloadRef): Promise<string | Buffer> {
    let response: api.DownloadBatchResponse;
    try {
      response = await this.client.downloadProducerCsv({ id, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    const compressedData = Buffer.from(response.value.data, 'base64');

    const csvData = await uncompress(compressedData);

    return csvData;
  }

  async getRow({
    rowId,
    batchId,
    accountId,
  }: RowRef): Promise<UkwmRowWithMessage> {
    let response: api.GetRowResponse;
    try {
      response = await this.client.getRow({ rowId, batchId, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async getColumn({
    accountId,
    batchId,
    columnRef,
  }: ColumnRef): Promise<UkwmColumnWithMessage> {
    let response: api.GetColumnResponse;
    try {
      response = await this.client.getColumn({ columnRef, batchId, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async getSubmissions(req: SubmissionRef): Promise<UkwmPagedSubmissionData> {
    let response: api.GetBulkSubmissionsResponse;
    try {
      response = await this.client.getBulkSubmissions(req);
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }
}
