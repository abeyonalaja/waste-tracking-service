import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { fromBoom, success } from '@wts/util/invocation';
import Boom from '@hapi/boom';
import { BatchRepository } from '../data/repository';
import { Handler } from '@wts/api/common';
import * as api from '@wts/api/green-list-waste-export-bulk';
import { BulkSubmission } from '../model';
import { DaprAnnexViiClient } from '@wts/client/green-list-waste-export';
import { submission } from '@wts/api/green-list-waste-export';

export default class BatchController {
  constructor(
    private repository: BatchRepository,
    private daprAnnexViiClient: DaprAnnexViiClient,
    private logger: Logger
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
      return success(await this.repository.getBatch(id, accountId));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateBatch: Handler<api.UpdateBatchRequest, api.UpdateBatchResponse> =
    async ({ id, accountId }) => {
      try {
        const batch = await this.repository.getBatch(id, accountId);

        if (batch.state.status !== 'PassedValidation') {
          return fromBoom(Boom.badRequest('Batch has not passed validation.'));
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
            timestamp: timestamp,
            transactionId: transactionId,
            hasEstimates: batch.state.hasEstimates,
            submissions: batch.state.submissions,
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

  getBatchContent: Handler<
    api.GetBatchContentRequest,
    api.GetBatchContentResponse
  > = async ({ id, accountId }) => {
    try {
      const batch = await this.repository.getBatch(id, accountId);

      if (batch.state.status !== 'Submitted') {
        return fromBoom(Boom.badRequest('Batch has not submitted records.'));
      }

      const submissionIds = batch.state.submissions.map((s) => {
        return s.id;
      });

      let submissions: submission.GetBulkSubmissionsResponse;
      try {
        submissions = await this.daprAnnexViiClient.getBulkSubmissions({
          accountId,
          submissionIds,
        });
      } catch (error) {
        this.logger.error(error);
        throw Boom.internal();
      }

      if (!submissions.success) {
        this.logger.error(
          `Failed to get submissions for bulk record with accountId: ${accountId} and id: ${id}`
        );
        throw Boom.internal();
      }

      return success(submissions.value);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
