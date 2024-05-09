import { CosmosClient, Database } from '@azure/cosmos';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { Submission, DbContainerNameKey } from '../model';

import { IRepository } from './repository';

export default class CosmosRepository implements IRepository<Submission> {
  private cosmosDb: Database;

  constructor(
    private cosmosClient: CosmosClient,
    private cosmosDbName: string,
    private cosmosContainerMap: Map<DbContainerNameKey, string>,
    private logger: Logger
  ) {
    this.cosmosDb = this.cosmosClient.database(this.cosmosDbName);
  }

  async createBulkRecords(
    containerName: DbContainerNameKey,
    accountId: string,
    values: Submission[]
  ): Promise<void> {
    const records = values.map((s) => {
      return {
        value: {
          accountId: accountId,
          ...s,
        },
        id: s.id,
      };
    });

    try {
      await this.cosmosDb
        .container(this.cosmosContainerMap.get(containerName) as string)
        .scripts.storedProcedure('createBulkRecords')
        .execute(accountId, [records]);
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }
}
