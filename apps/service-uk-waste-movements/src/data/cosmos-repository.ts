import {
  CosmosClient,
  Database,
  PatchOperation,
  SqlParameter,
  SqlQuerySpec,
} from '@azure/cosmos';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import {
  Draft,
  DbContainerNameKey,
  GetDraftsResult,
  GetDraftsDto,
} from '../model';
import { IRepository } from './repository';

type RecordData<T> = T & { accountId: string };

export default class CosmosRepository implements IRepository<Draft> {
  private cosmosDb: Database;

  constructor(
    private cosmosClient: CosmosClient,
    private cosmosDbName: string,
    private cosmosContainerMap: Map<DbContainerNameKey, string>,
    private logger: Logger,
  ) {
    this.cosmosDb = this.cosmosClient.database(this.cosmosDbName);
  }

  async createBulkRecords(
    containerName: DbContainerNameKey,
    accountId: string,
    values: Draft[],
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
    id: string,
  ): Promise<Draft> {
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

    const data = items[0].value as RecordData<Draft>;

    return {
      id: data.id,
      wasteInformation: data.wasteInformation,
      receiver: data.receiver,
      carrier: data.carrier,
      producerAndCollection: data.producerAndCollection,
      declaration: data.declaration,
      state: data.state,
    };
  }

  async getDrafts(
    containerName: DbContainerNameKey,
    page: number,
    pageSize: number,
    collectionDate?: Date,
    ewcCode?: string,
    producerName?: string,
    wasteMovementId?: string,
  ): Promise<GetDraftsResult> {
    if (page <= 0) {
      page = 1;
    }

    let dataQuery = `SELECT distinct value
                  {
                      id: c["id"],
                      wasteMovementId: c['value'].declaration['value'].transactionId, 
                      name: c["value"].producerAndCollection.producer.contact.organisationName,
                      ewcCode: c["value"].wasteInformation.wasteTypes[0].ewcCode,
                      collectionDate: {
                          day: c["value"].producerAndCollection.wasteCollection.expectedWasteCollectionDate.day,
                          month: c["value"].producerAndCollection.wasteCollection.expectedWasteCollectionDate.month,
                          year: c["value"].producerAndCollection.wasteCollection.expectedWasteCollectionDate.year
                      }
                  }
                  FROM c JOIN wt IN c["value"].wasteInformation.wasteTypes`;

    if (wasteMovementId) {
      dataQuery += `WHERE c['value'].declaration['value'].transactionId = @wasteMovementId`;
      const dataByTransactionIdQuerySpec: SqlQuerySpec = {
        query: dataQuery,
        parameters: [
          {
            name: '@wasteMovementId',
            value: wasteMovementId,
          },
        ],
      };

      const { resources: dataByTransactionIdItems } = await this.cosmosDb
        .container(this.cosmosContainerMap.get(containerName) as string)
        .items.query<GetDraftsDto>(dataByTransactionIdQuerySpec)
        .fetchAll();

      return {
        page: 1,
        totalPages: 1,
        totalRecords: dataByTransactionIdItems.length,
        values: dataByTransactionIdItems,
      };
    }

    const queryFilters: string[] = [];

    const queryParameters: SqlParameter[] = [];

    if (ewcCode) {
      queryFilters.push(`wt["ewcCode"] = @ewcCode`);
      queryParameters.push({
        name: '@ewcCode',
        value: ewcCode,
      });
    }

    if (producerName) {
      queryFilters.push(
        `LOWER(c["value"].producerAndCollection.producer.contact.organisationName) like @producerOrgName`,
      );
      queryParameters.push({
        name: '@producerOrgName',
        value: `%${producerName.toLowerCase()}%`,
      });
    }

    if (collectionDate) {
      queryFilters.push(
        `c["value"].producerAndCollection.wasteCollection.expectedWasteCollectionDate.day = @day AND 
         c["value"].producerAndCollection.wasteCollection.expectedWasteCollectionDate.month = @month AND 
         c["value"].producerAndCollection.wasteCollection.expectedWasteCollectionDate.year = @year`,
      );
      queryParameters.push({
        name: '@day',
        value: collectionDate.getDate(),
      });
      queryParameters.push({
        name: '@month',
        value: collectionDate.getMonth() + 1,
      });
      queryParameters.push({
        name: '@year',
        value: collectionDate.getFullYear(),
      });
    }

    if (queryFilters.length > 0) {
      dataQuery += ` WHERE ${queryFilters.join(' AND ')}`;
    }

    const countQuery = `SELECT VALUE count(data)
                      FROM (${dataQuery}) as data`;

    dataQuery += ` order by c["_ts"] desc OFFSET @offset LIMIT @limit`;

    const dataQuerySpec: SqlQuerySpec = {
      query: dataQuery,
      parameters: [
        {
          name: '@offset',
          value: (page - 1) * pageSize,
        },
        {
          name: '@limit',
          value: pageSize,
        },
        ...queryParameters,
      ],
    };

    const countQuerySpec: SqlQuerySpec = {
      query: countQuery,
      parameters: queryParameters,
    };

    const { resources: countItems } = await this.cosmosDb
      .container(this.cosmosContainerMap.get(containerName) as string)
      .items.query(countQuerySpec)
      .fetchAll();

    const { resources: dataItems } = await this.cosmosDb
      .container(this.cosmosContainerMap.get(containerName) as string)
      .items.query<GetDraftsDto>(dataQuerySpec)
      .fetchAll();

    return {
      page: page,
      totalPages: Math.ceil(countItems[0] / pageSize),
      totalRecords: countItems[0],
      values: dataItems,
    };
  }

  async saveRecord(
    containerName: DbContainerNameKey,
    value: Draft,
    accountId: string,
  ): Promise<void> {
    const data: RecordData<Draft> = {
      ...value,
      accountId,
    };
    try {
      const { resource: item } = await this.cosmosDb
        .container(this.cosmosContainerMap.get(containerName) as string)
        .item(data.id, data.accountId)
        .read();

      if (!item) {
        const createItem = {
          id: data.id,
          value: data,
          partitionKey: data.accountId,
        };
        await this.cosmosDb
          .container(this.cosmosContainerMap.get(containerName) as string)
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
          .container(this.cosmosContainerMap.get(containerName) as string)
          .item(data.id, data.accountId)
          .patch(replaceOperation);
      }
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        err.code === 409
      ) {
        throw Boom.conflict(
          `A ${containerName.substring(
            0,
            containerName.length - 1,
          )} with this name already exists`,
        );
      }
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }
}
