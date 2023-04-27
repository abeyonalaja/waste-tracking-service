import { DraftSubmission, DraftSubmissionSummary } from '../model';

export interface DraftRepository {
  getDrafts(accountId: string): Promise<DraftSubmissionSummary[]>;
  getDraft(id: string, accountId: string): Promise<DraftSubmission>;
  saveDraft(value: DraftSubmission, accountId: string): Promise<void>;
}
