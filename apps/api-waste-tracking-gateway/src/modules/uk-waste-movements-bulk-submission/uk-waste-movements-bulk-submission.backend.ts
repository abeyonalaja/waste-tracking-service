import Boom from '@hapi/boom';
import { DaprUkWasteMovementsBulkClient } from '@wts/client/uk-waste-movements-bulk';
import { compress } from 'snappy';
import { Logger } from 'winston';
import { UkwmBulkSubmission } from '@wts/api/waste-tracking-gateway';
import * as api from '@wts/api/uk-waste-movements-bulk';

export type BatchRef = {
  id: string;
  accountId: string;
};

export type Input = {
  type: string;
  data: Buffer;
};

export interface UkWasteMovementsBulkSubmissionBackend {
  createBatch(accountId: string, inputs: Input[]): Promise<{ id: string }>;
  getBatch(ref: BatchRef): Promise<UkwmBulkSubmission>;
  finalizeBatch(ref: BatchRef): Promise<void>;
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

    if (response.value.state.status == 'Submitted') {
      return {
        id: response.value.id,
        state: {
          status: response.value.state.status,
          timestamp: response.value.state.timestamp,
          transactionId: response.value.state.transactionId,
          submissions: response.value.state.submissions.map((v) => ({
            id: v.id,
            wasteMovementId: v.submissionDeclaration.transactionId,
            producerName: v.producer.contact.organisationName,
            ewcCodes: v.wasteTypes.map((wt) => wt.ewcCode),
            collectionDate: {
              day: v.wasteCollection.expectedWasteCollectionDate.day,
              month: v.wasteCollection.expectedWasteCollectionDate.month,
              year: v.wasteCollection.expectedWasteCollectionDate.year,
            },
          })),
        },
      } as UkwmBulkSubmission;
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
}
