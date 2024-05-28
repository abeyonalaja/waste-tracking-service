import {
  CosmosClient,
  Database,
  SqlParameter,
  SqlQuerySpec,
} from '@azure/cosmos';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import {
  DraftSubmission,
  DbContainerNameKey,
  GetDraftsResult,
  GetDraftsDto,
} from '../model';
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
      carrier: data.carrier,
      producerAndCollection: data.producerAndCollection,
      submissionDeclaration: data.submissionDeclaration,
      submissionState: data.submissionState,
    };
  }

  async getDrafts(
    containerName: DbContainerNameKey,
    page: number,
    pageSize: number,
    collectionDate?: Date,
    ewcCode?: string,
    producerName?: string,
    wasteMovementId?: string
  ): Promise<GetDraftsResult> {
    if (page <= 0) {
      page = 1;
    }

    let dataQuery = `SELECT distinct value
                  {
                      id: c["id"],
                      wasteMovementId: c['value'].transactionId, 
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
      dataQuery += ` WHERE c["value"].transactionId = @wasteMovementId`;
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
        `LOWER(c["value"].producerAndCollection.producer.contact.organisationName) like @producerOrgName`
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
         c["value"].producerAndCollection.wasteCollection.expectedWasteCollectionDate.year = @year`
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
}
