import { DbContainerNameKey } from '../model';

export interface ServiceChargeRepository<T> {
  getRecord(
    accountId: string,
    containerName: DbContainerNameKey,
    id?: string,
  ): Promise<T>;
  saveRecord(
    containerName: DbContainerNameKey,
    value: T,
    accountId: string,
  ): Promise<void>;
  deleteRecord(
    containerName: DbContainerNameKey,
    id: string,
    accountId: string,
  ): Promise<void>;
}
