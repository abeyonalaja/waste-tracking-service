import Boom from '@hapi/boom';
import { DaprAnnexViiBulkClient } from '@wts/client/green-list-waste-export-bulk';
import { compress } from 'snappy';
import { Logger } from 'winston';
import { BulkSubmission, Submission } from '@wts/api/waste-tracking-gateway';
import {
  GetBatchContentResponse,
  GetBatchResponse,
  UpdateBatchResponse,
} from '@wts/api/green-list-waste-export-bulk';

export interface BatchRef {
  id: string;
  accountId: string;
}

export interface Input {
  type: string;
  data: Buffer;
}

export interface BulkSubmissionBackend {
  createBatch(accountId: string, inputs: Input[]): Promise<{ id: string }>;
  getBatch(ref: BatchRef): Promise<BulkSubmission>;
  finalizeBatch(ref: BatchRef): Promise<void>;
  getBatchSubmissions(ref: BatchRef): Promise<Submission[]>;
}

export class AnnexViiBulkServiceBackend implements BulkSubmissionBackend {
  constructor(
    private client: DaprAnnexViiBulkClient,
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
            value: (await compress(input.data)).toString('base64'),
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

  async getBatch({ id, accountId }: BatchRef): Promise<BulkSubmission> {
    let response: GetBatchResponse;
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

    return response.value as BulkSubmission;
  }

  async finalizeBatch({ id, accountId }: BatchRef): Promise<void> {
    let response: UpdateBatchResponse;
    try {
      response = await this.client.updateBatch({
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

  async getBatchSubmissions({
    id,
    accountId,
  }: BatchRef): Promise<Submission[]> {
    let response: GetBatchContentResponse;
    try {
      response = await this.client.getBatchContent({ id, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as Submission[];
  }
}
