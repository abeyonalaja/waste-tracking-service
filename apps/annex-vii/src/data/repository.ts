import {
  DraftSubmission,
  DraftSubmissionSummaryPage,
  Submission,
  NumberOfSubmissions,
} from '../model';
import { BaseRepository } from './base-repository';

export interface DraftRepository extends BaseRepository {
  getDrafts(
    accountId: string,
    order: 'ASC' | 'DESC',
    pageLimit?: number,
    state?: DraftSubmission['submissionState']['status'][],
    token?: string
  ): Promise<DraftSubmissionSummaryPage>;
  getDraft(id: string, accountId: string): Promise<DraftSubmission>;
  getSubmission(id: string, accountId: string): Promise<Submission>;
  saveSubmission(value: Submission, accountId: string): Promise<void>;
  saveDraft(value: DraftSubmission, accountId: string): Promise<void>;
  createSubmissionFromDraft(
    value: DraftSubmission,
    accountId: string
  ): Promise<void>;
  createDraftFromTemplate(
    id: string,
    accountId: string,
    reference: string
  ): Promise<DraftSubmission>;
  getNumberOfSubmissions(accountId: string): Promise<NumberOfSubmissions>;
}
