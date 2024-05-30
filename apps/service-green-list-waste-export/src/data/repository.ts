import {
  DbContainerNameKey,
  RecordStateStatus,
  RecordSummaryPage,
} from '../model';

export interface IRepository<T> {
  getRecords(
    containerName: DbContainerNameKey,
    accountId: string,
    order: 'ASC' | 'DESC',
    pageLimit?: number,
    token?: string,
    state?: RecordStateStatus[],
  ): Promise<
    RecordSummaryPage<
      | Omit<
          T,
          | 'wasteQuantity'
          | 'exporterDetail'
          | 'importerDetail'
          | 'carriers'
          | 'collectionDetail'
          | 'ukExitLocation'
          | 'transitCountries'
          | 'recoveryFacilityDetail'
          | 'submissionConfirmation'
        >
      | Omit<
          T,
          | 'wasteDescription'
          | 'exporterDetail'
          | 'importerDetail'
          | 'carriers'
          | 'collectionDetail'
          | 'ukExitLocation'
          | 'transitCountries'
          | 'recoveryFacilityDetail'
        >
    >
  >;
  getRecord(
    containerName: DbContainerNameKey,
    id: string,
    accountId: string,
  ): Promise<T>;
  saveRecord(
    containerName: DbContainerNameKey,
    value: T,
    accountId: string,
  ): Promise<void>;
  createBulkRecords(
    containerName: DbContainerNameKey,
    accountId: string,
    values: Omit<T, 'submissionDeclaration' | 'submissionState'>[],
  ): Promise<void>;
  deleteRecord(
    containerName: DbContainerNameKey,
    id: string,
    accountId: string,
  ): Promise<void>;
  getTotalNumber(
    containerName: DbContainerNameKey,
    accountId: string,
  ): Promise<number>;
}
