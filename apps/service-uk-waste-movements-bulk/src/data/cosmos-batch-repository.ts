import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { BatchRepository } from './batch-repository';
import { BulkSubmission } from '../model';
import { CosmosClient, Database, PatchOperation } from '@azure/cosmos';

type BulkSubmissionData = BulkSubmission & { accountId: string };

export class CosmosBatchRepository implements BatchRepository {
  private cosmosDb: Database;

  constructor(
    private cosmosClient: CosmosClient,
    private cosmosDbName: string,
    private draftContainerName: string,
    private logger: Logger
  ) {
    this.cosmosDb = this.cosmosClient.database(this.cosmosDbName);
  }

  async saveBatch(value: BulkSubmission, accountId: string): Promise<void> {
    const data: BulkSubmissionData = { ...value, accountId };
    try {
      const { resource: item } = await this.cosmosDb
        .container(this.draftContainerName)
        .item(data.id, data.accountId)
        .read();

      if (!item) {
        const createItem = {
          id: data.id,
          value: data,
          partitionKey: data.accountId,
        };
        await this.cosmosDb
          .container(this.draftContainerName)
          .items.create(createItem);
      } else {
        const replaceOperation: PatchOperation[] = [
          {
            op: 'replace',
            path: '/value',
            value: data,
          },
        ];
        await this.cosmosDb
          .container(this.draftContainerName)
          .item(data.id, data.accountId)
          .patch(replaceOperation);
      }
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }

  async getBatch(id: string, accountId: string): Promise<BulkSubmission> {
    const { resource: item } = await this.cosmosDb
      .container(this.draftContainerName)
      .item(id, accountId)
      .read();

    if (!item) {
      throw Boom.notFound();
    }

    const data = item.value as BulkSubmissionData;
    return {
      id: data.id,
      state: data.state,
    };
  }
}
