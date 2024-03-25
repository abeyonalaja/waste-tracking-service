import Boom from '@hapi/boom';
import { DaprUkWasteMovementsBulkClient } from '@wts/client/uk-waste-movements-bulk';
import { compress } from 'snappy';
import { Logger } from 'winston';
import { BulkSubmission } from '@wts/api/waste-tracking-gateway';
import { v4 as uuidv4 } from 'uuid';
import * as api from '@wts/api/uk-waste-movements-bulk';

export type BatchRef = {
  id: string;
  accountId: string;
};

export type Input = {
  type: string;
  data: Buffer;
};
const batches = new Map<string, BulkSubmission>();

export interface UkWasteMovementsBulkSubmissionBackend {
  createBatch(accountId: string, inputs: Input[]): Promise<{ id: string }>;
  getBatch(ref: BatchRef): Promise<BulkSubmission>;
  finalizeBatch(ref: BatchRef): Promise<void>;
}

export class InMemoryUkWasteMovementsBulkSubmissionBackend
  implements UkWasteMovementsBulkSubmissionBackend
{
  async createBatch(
    accountId: string,
    inputs: Input[]
  ): Promise<{ id: string }> {
    if (!inputs) {
      throw Boom.badRequest('Provide a csv');
    }

    return {
      id: accountId,
    };
  }

  getBatch({ id, accountId }: BatchRef): Promise<BulkSubmission> {
    const value = batches.get(JSON.stringify({ id, accountId }));
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(value);
  }

  finalizeBatch({ id, accountId }: BatchRef): Promise<void> {
    const value = batches.get(JSON.stringify({ id, accountId }));
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const timestamp = new Date();
    const transactionId =
      timestamp.getFullYear().toString().substring(2) +
      (timestamp.getMonth() + 1).toString().padStart(2, '0') +
      '_' +
      id.substring(0, 8).toUpperCase();

    value.state = {
      status: 'Submitted',
      timestamp: timestamp,
      transactionId: transactionId,
      submissions: [
        {
          id: uuidv4(),
          transactionId: '2307_1234ABCD',
        },
      ],
    };

    batches.set(JSON.stringify({ id, accountId }), value);
    return Promise.resolve();
  }
}

export class ServiceUkWasteMovementsBulkSubmissionBackend
  implements UkWasteMovementsBulkSubmissionBackend
{
  constructor(
    private client: DaprUkWasteMovementsBulkClient,
    private logger: Logger
  ) {}

  async createBatch(
    accountId: string,
    inputs: Input[]
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

    return response.value as BulkSubmission;
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
}
