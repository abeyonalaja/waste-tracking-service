import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { ReferenceDataRepository } from './repository';
import { Database, CosmosClient, PatchOperation } from '@azure/cosmos';
import { LRUCache } from 'lru-cache';

export interface CacheItem<T> {
  value: T;
}
interface ListData<T> {
  type: string;
  values: T[];
}

export default class CosmosReferenceDataRepository
  implements ReferenceDataRepository
{
  private cosmosDb: Database;

  constructor(
    private cosmosClient: CosmosClient,
    private cosmosDbName: string,
    private containerName: string,
    private cache: LRUCache<string, CacheItem<unknown>>,
    private logger: Logger,
  ) {
    this.cosmosDb = this.cosmosClient.database(this.cosmosDbName);
  }

  async getList<T>(id: string): Promise<T[]> {
    const cached = this.cache.get(id);
    if (cached !== undefined && cached) {
      this.cache.delete(id);
      this.cache.set(id, cached);
      return cached.value as T[];
    }

    const { resource: item } = await this.cosmosDb
      .container(this.containerName)
      .item(id, id)
      .read();
    if (!item) {
      throw Boom.notFound();
    }
    const data = item.value as ListData<T>;
    this.cache.set(id, { value: data.values });
    return data.values;
  }

  async saveList<T>(id: string, values: T[]): Promise<void> {
    const data: ListData<T> = { type: id, values };
    try {
      const { resource: item } = await this.cosmosDb
        .container(this.containerName)
        .item(data.type)
        .read();

      if (!item) {
        const createItem = {
          id: data.type,
          value: data,
          partitionKey: data.type,
        };
        await this.cosmosDb
          .container(this.containerName)
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
          .container(this.containerName)
          .item(data.type)
          .patch(replaceOperation);
      }
      const cached = this.cache.get(data.type);
      if (cached !== undefined && cached) {
        this.cache.delete(data.type);
      }
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }
}
