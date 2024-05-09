import { DbContainerNameKey } from '../model';

export interface IRepository<T> {
  createBulkRecords(
    containerName: DbContainerNameKey,
    accountId: string,
    values: Omit<T, 'submissionDeclaration' | 'submissionState'>[]
  ): Promise<void>;
}
