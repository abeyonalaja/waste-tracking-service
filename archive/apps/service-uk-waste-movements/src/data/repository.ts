import { DbContainerNameKey, Draft, GetDraftsResult } from '../model';

export interface IRepository<T> {
  createBulkRecords(
    containerName: DbContainerNameKey,
    accountId: string,
    values: Omit<T, 'declaration' | 'state'>[],
  ): Promise<void>;

  getDraft(
    containerName: DbContainerNameKey,
    id: string,
    accountId: string,
  ): Promise<Draft>;

  getDrafts(
    contanerName: DbContainerNameKey,
    page: number,
    pageSize: number,
    collectionDate?: Date,
    ewcCode?: string,
    producerName?: string,
    wasteMovementId?: string,
  ): Promise<GetDraftsResult>;
  saveRecord(
    containerName: DbContainerNameKey,
    value: T,
    accountId: string,
  ): Promise<void>;
}
