import { DraftSubmission } from '@wts/api/uk-waste-movements';
import { DbContainerNameKey } from '../model';

export interface IRepository<T> {
  createBulkRecords(
    containerName: DbContainerNameKey,
    accountId: string,
    values: Omit<T, 'submissionDeclaration' | 'submissionState'>[]
  ): Promise<void>;

  getDraft(
    containerName: DbContainerNameKey,
    id: string
  ): Promise<DraftSubmission>;
}
