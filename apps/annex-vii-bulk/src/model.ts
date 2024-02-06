import * as api from '@wts/api/annex-vii-bulk';
import { BulkSubmissionCsvRow } from './lib/csv-content';
import { Response } from '@wts/util/invocation';

export type ContentProcessingTask = {
  batchId: string;
  accountId: string;
  content: string;
};

export type ValidateCsvContentRequest = api.AddContentToBatchRequest;
export type ValidateCsvContentResponse = Response<{
  batchId: string | undefined;
  accountId: string;
  rows: BulkSubmissionCsvRow[];
}>;

export type BulkSubmission = api.BulkSubmission;
