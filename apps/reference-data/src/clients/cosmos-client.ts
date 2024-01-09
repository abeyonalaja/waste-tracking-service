import {
  CosmosClient,
  Database,
  FeedOptions,
  PatchOperation,
  SqlQuerySpec,
} from '@azure/cosmos';

export default class CosmosReferenceDataClient {
  private cosmosDb: Database;

  constructor(
    private cosmosClient: CosmosClient,
    private cosmosDbName: string
  ) {
    this.cosmosDb = this.cosmosClient.database(this.cosmosDbName);
  }

  async readItem(containerName: string, id: string, partitionKeyValue: string) {
    const { resource: item } = await this.cosmosDb
      .container(containerName)
      .item(id, partitionKeyValue)
      .read();

    return item;
  }

  async queryContainerNext(
    containerName: string,
    querySpec: SqlQuerySpec,
    queryOptions: FeedOptions
  ) {
    const {
      resources: results,
      hasMoreResults,
      continuationToken,
    } = await this.cosmosDb
      .container(containerName)
      .items.query(querySpec, queryOptions)
      .fetchNext();
    return { results, hasMoreResults, continuationToken };
  }

  async createOrReplaceItem(
    containerName: string,
    id: string,
    partitionKeyValue: string,
    data: any
  ) {
    const item = await this.readItem(containerName, id, partitionKeyValue);
    if (!item) {
      const createItem = {
        id: id,
        value: data,
        partitionKey: partitionKeyValue,
      };
      await this.cosmosDb.container(containerName).items.create(createItem);
    } else {
      const replaceOperation: PatchOperation[] = [
        {
          op: 'replace',
          path: '/value',
          value: data,
        },
      ];
      await this.cosmosDb
        .container(containerName)
        .item(id, partitionKeyValue)
        .patch(replaceOperation);
    }
  }

  async updateItem(
    containerName: string,
    id: string,
    partitionKeyValue: string,
    path: string,
    op: PatchOperation['op'],
    data: any
  ) {
    const replaceOperation: PatchOperation[] = [
      {
        op: op,
        path: path,
        value: data,
      },
    ];
    await this.cosmosDb
      .container(containerName)
      .item(id, partitionKeyValue)
      .patch(replaceOperation);
  }

  async deleteItem(
    containerName: string,
    id: string,
    partitionKeyValue: string
  ) {
    try {
      await this.cosmosDb
        .container(containerName)
        .item(id, partitionKeyValue)
        .delete();
    } catch (err: any) {
      if (err.code && err.code === 404) {
        console.log(
          `Record with ID: '${id}' and partitionKey: '${partitionKeyValue}' not found`
        );
        return;
      }
    }
  }
}
