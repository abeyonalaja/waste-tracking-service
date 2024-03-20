import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { fromBoom, success } from '@wts/util/invocation';
import Boom from '@hapi/boom';
import { BatchRepository } from '../data';
import { Handler } from '@wts/api/common';
import * as api from '@wts/api/service-uk-waste-movements-bulk';
import { BulkSubmission } from '../model';

export class BatchController {
  constructor(private repository: BatchRepository, private logger: Logger) {}

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
        accountId
      );
      const response: api.GetBatchResponse = success(data);
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
        const data: BulkSubmission = await this.repository.getBatch(
          id,
          accountId
        );

        if (data.state.status !== 'PassedValidation') {
          throw Boom.badRequest('Batch has not passed validation');
        }

        data.state = {
          status: 'Submitted',
          timestamp: new Date(),
          transactionId: uuidv4(),
        };

        await this.repository.saveBatch(data, accountId);

        return success(undefined);
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };
}
