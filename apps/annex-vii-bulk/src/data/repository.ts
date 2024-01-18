import { BulkSubmission } from '../model';

export interface BatchRepository {
  saveBatch(value: BulkSubmission, accountId: string): Promise<void>;
  getBatch(id: string, accountId: string): Promise<BulkSubmission>;
}
