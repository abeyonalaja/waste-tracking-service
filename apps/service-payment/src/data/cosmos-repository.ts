import {
  Database,
  ErrorResponse,
  PatchOperation,
  SqlQuerySpec,
} from '@azure/cosmos';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { CreatedPayment, DbContainerNameKey, PaymentRecord } from '../model';
import { ServiceChargeRepository } from './repository';

type RecordData<T> = T & { accountId: string };

function getLatestRecord(accountId: string): SqlQuerySpec {
  const querySpec: SqlQuerySpec = {
    query: `SELECT TOP 1 * FROM c 
      WHERE c["value"].accountId = @accountId
      ORDER BY c["value"]["state"].expiryDate DESC`,
    parameters: [
      {
        name: '@accountId',
        value: accountId,
      },
    ],
  };
  return querySpec;
}

export default class CosmosServiceChargeRepository
  implements ServiceChargeRepository<CreatedPayment | PaymentRecord>
{
  constructor(
    private cosmosDb: Database,
    private cosmosContainerMap: Map<DbContainerNameKey, string>,
    private logger: Logger,
  ) {}

  async getRecord(
    accountId: string,
    containerName: DbContainerNameKey = 'service-charges',
    id?: string,
  ): Promise<CreatedPayment | PaymentRecord> {
    if (!id) {
      const options = {
        maxItemCount: -1,
        partitionKey: accountId,
      };

      const { resources: results } = await this.cosmosDb
        .container(this.cosmosContainerMap.get(containerName) as string)
        .items.query(getLatestRecord(accountId), options)
        .fetchAll();

      if (results === undefined || results.length === 0) {
        throw Boom.notFound();
      }

      const data = results[0].value as RecordData<PaymentRecord>;
      return {
        id: data.id,
        amount: data.amount,
        description: data.description,
        reference: data.reference,
        paymentId: data.paymentId,
        state: data.state,
        expiryDate: data.expiryDate,
      };
    } else {
      const { resource: item } = await this.cosmosDb
        .container(this.cosmosContainerMap.get(containerName) as string)
        .item(id, accountId)
        .read();

      if (!item) {
        throw Boom.notFound();
      }

      if (containerName === 'drafts') {
        const data = item.value as RecordData<CreatedPayment>;
        return {
          id: data.id,
          amount: data.amount,
          description: data.description,
          reference: data.reference,
          paymentId: data.paymentId,
          createdDate: data.createdDate,
          returnUrl: data.returnUrl,
          redirectUrl: data.redirectUrl,
          cancelUrl: data.cancelUrl,
        };
      } else {
        const data = item.value as RecordData<PaymentRecord>;
        return {
          id: data.id,
          amount: data.amount,
          description: data.description,
          reference: data.reference,
          paymentId: data.paymentId,
          state: data.state,
          expiryDate: data.expiryDate,
        };
      }
    }
  }

  async saveRecord(
    containerName: DbContainerNameKey,
    value: CreatedPayment | PaymentRecord,
    accountId: string,
  ): Promise<void> {
    const data: RecordData<CreatedPayment | PaymentRecord> = {
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
      if (err instanceof ErrorResponse) {
        this.logger.error('Error writing Cosmos DB item', err);
        throw Boom.internal(err.message);
      } else {
        this.logger.error('Unknown error thrown from Cosmos client', {
          error: err,
        });
        throw Boom.internal();
      }
    }
  }

  async deleteRecord(
    containerName: DbContainerNameKey = 'drafts',
    id: string,
    accountId: string,
  ): Promise<void> {
    try {
      await this.cosmosDb
        .container(this.cosmosContainerMap.get(containerName) as string)
        .item(id, accountId)
        .delete();
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        err.code === 404
      ) {
        throw Boom.notFound();
      }
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }
}
