import { CosmosClient, Database } from '@azure/cosmos';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { DraftSubmission, DbContainerNameKey } from '../model';

import { IRepository } from './repository';

type RecordData<T> = T;

export default class CosmosRepository implements IRepository<DraftSubmission> {
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
    values: DraftSubmission[]
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

  async getDraft(
    containerName: DbContainerNameKey,
    id: string
  ): Promise<DraftSubmission> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [
        {
          name: '@id',
          value: id,
        },
      ],
    };

    const { resources: items } = await this.cosmosDb
      .container(this.cosmosContainerMap.get(containerName) as string)
      .items.query(querySpec)
      .fetchAll();

    if (items.length === 0) {
      throw Boom.notFound();
    }

    const data = items[0].value as RecordData<DraftSubmission>;

    return {
      id: data.id,
      transactionId: data.transactionId,
      wasteInformation: data.wasteInformation,
      receiver: data.receiver,
      producerAndCollection: data.producerAndCollection,
      submissionDeclaration: data.submissionDeclaration,
      submissionState: data.submissionState,
    };
  }
}
