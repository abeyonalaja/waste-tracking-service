import {
  BulkSubmission,
  SubmissionFlattenedDownload,
  Row,
  ErrorColumn,
  PagedSubmissionData,
} from '../model';

export interface BatchRepository {
  saveBatch(value: BulkSubmission, accountId: string): Promise<void>;
  getBatch(id: string, accountId: string): Promise<BulkSubmission>;
  getRow(accountId: string, batchId: string, rowId: string): Promise<Row>;
  getColumn(
    accountId: string,
    batchId: string,
    columnRef: string,
  ): Promise<ErrorColumn>;
  downloadProducerCsv(
    id: string,
    accountId: string,
  ): Promise<SubmissionFlattenedDownload[]>;
  getBatchRows(batchId: string, accountId: string): Promise<Row[]>;
  saveRows(rows: Row[], accountId: string, batchId: string): Promise<void>;
  saveColumns(
    columns: ErrorColumn[],
    accountId: string,
    batchId: string,
  ): Promise<void>;

  getBulkSubmissions(
    batchId: string,
    accountId: string,
    page: number,
    pageSize: number,
    collectionDate?: Date,
    ewcCode?: string,
    producerName?: string,
    wasteMovementId?: string,
  ): Promise<PagedSubmissionData>;
}
