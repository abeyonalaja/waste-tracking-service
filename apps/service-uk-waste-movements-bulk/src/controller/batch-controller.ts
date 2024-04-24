import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { fromBoom, success } from '@wts/util/invocation';
import Boom from '@hapi/boom';
import { BatchRepository } from '../data';
import { Handler } from '@wts/api/common';
import * as api from '@wts/api/uk-waste-movements-bulk';
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
        const submissions = await this.repository.getBatch(id, accountId);

        if (submissions.state.status !== 'PassedValidation') {
          throw Boom.badRequest('Batch has not passed validation');
        }

        const timestamp = new Date();
        const transactionId =
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
            submissions: submissions.state.submissions,
          },
        };
        return success(
          await this.repository.saveBatch(bulkSubmission, accountId)
        );
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };
}
