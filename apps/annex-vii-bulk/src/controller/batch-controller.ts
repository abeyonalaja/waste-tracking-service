import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { fromBoom, success } from '@wts/util/invocation';
import Boom from '@hapi/boom';
import { BatchRepository } from '../data/repository';
import { Handler } from '@wts/api/common';
import * as api from '@wts/api/annex-vii-bulk';
import { BulkSubmission } from '../model';

export default class BatchController {
  constructor(private repository: BatchRepository, private logger: Logger) {}

  addBatchContent: Handler<
    api.AddBatchContentRequest,
    api.AddBatchContentResponse
  > = async ({ accountId }) => {
    try {
      const id = uuidv4();
      const bulkSubmission: BulkSubmission = {
        id: id,
        state: {
          status: 'Processing',
          timestamp: new Date(),
        },
      };

      await this.repository.saveBatch(bulkSubmission, accountId);
      return success({ batchId: id });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getBatchContent: Handler<
    api.GetBatchContentRequest,
    api.GetBatchContentResponse
  > = async ({ id, accountId }) => {
    try {
      return success(await this.repository.getBatch(id, accountId));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
