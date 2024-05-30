import { DbContainerNameKey, DraftSubmission, GetDraftsResult } from '../model';

export interface IRepository<T> {
  createBulkRecords(
    containerName: DbContainerNameKey,
    accountId: string,
    values: Omit<T, 'submissionDeclaration' | 'submissionState'>[],
  ): Promise<void>;

  getDraft(
    containerName: DbContainerNameKey,
    id: string,
  ): Promise<DraftSubmission>;

  getDrafts(
    contanerName: DbContainerNameKey,
    page: number,
    pageSize: number,
    collectionDate?: Date,
    ewcCode?: string,
    producerName?: string,
    wasteMovementId?: string,
  ): Promise<GetDraftsResult>;
}
