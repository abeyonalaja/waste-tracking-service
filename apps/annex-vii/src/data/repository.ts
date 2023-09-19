import { DraftSubmission, DraftSubmissionSummaryPage } from '../model';

export interface DraftRepository {
  getDrafts(
    accountId: string,
    order: 'ASC' | 'DESC',
    pageLimit?: number,
    state?: DraftSubmission['submissionState']['status'][],
    token?: string
  ): Promise<DraftSubmissionSummaryPage>;
  getDraft(id: string, accountId: string): Promise<DraftSubmission>;
  saveDraft(value: DraftSubmission, accountId: string): Promise<void>;
}
